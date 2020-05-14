const {
  Worker, isMainThread, parentPort
} = require('worker_threads');

const wait = (t) => new Promise(resolve => setTimeout(resolve, t));

if (isMainThread) {
  const os = require('os');
  const path = require('path');
  const cliProgress = require('cli-progress');
  
  const {
    constants: {RDF_ARCHIVE_URL, STORAGE_PATH},
    createTempDir,
    cleanupInDir,
    downloadRemoteFile,
    extractRDFArchive,
    getRDFFilesInDir,
  } = require('../lib');
  
  let tempDir;
  
  (async () => {
    try {
      const progressBar = new cliProgress.SingleBar(
        {
          hideCursor: false,
          format: 'progress [{bar}] {percentage}% | {value}/{total}'
        },
        cliProgress.Presets.shades_classic
      );
      
      let fileSize = 0, downloadedBytes = 0;
      
      function onHeaders(headers) {
        fileSize = headers['content-length'];
        progressBar.start(fileSize, 0);
      }
      
      function onData(data) {
        downloadedBytes += data.length;
        progressBar.update(downloadedBytes);
      }
      
      
      tempDir = await createTempDir(STORAGE_PATH);
      const archiveFilePath = path.join(tempDir, 'rdf-files.tar.zip');
      console.log(`downloading ${RDF_ARCHIVE_URL}`);
      await downloadRemoteFile(RDF_ARCHIVE_URL, archiveFilePath, onHeaders, onData);
      progressBar.stop();
      
      await extractRDFArchive(archiveFilePath);
      const files = await getRDFFilesInDir(tempDir);
      if(files.length) {
        console.log(`processing ${files.length} files`);
        progressBar.start(files.length, 0);

        const workers = os.cpus().map(() => {
          const instance = new Worker(__filename);
          const worker = {busy: true, instance};

          instance.on('message', (message) => {
            if (message === 'ready') worker.busy = false;
            if (message === 'done') {
              worker.busy = false;
              progressBar.increment();
            }
          });

          instance.on('error', () => {
            worker.instance.terminate();
            worker.instance = new Worker(__filename);
            worker.busy = true;
          });

          return worker;
        });
        
        let fileIndex = 0;
        let workerIndex = 0;
        do {
          if (workerIndex === workers.length) {workerIndex = 0;}
          if (workers[workerIndex].busy) {
            workerIndex++;
            await wait(1); // to avoid blocking main thread with sync tasks
            continue;
          }
          
          workers[workerIndex].busy = true;
          workers[workerIndex].instance.postMessage(files[fileIndex]);

          fileIndex++;
        } while (fileIndex < files.length);
        
        while(workers.find(({busy}) => busy === true)) await wait(100);
        workers.forEach(({instance}) => instance.terminate());
        
        progressBar.stop();
      }
    } catch(error) {
      console.error(error);
    } finally {
      console.log(`cleaning up ${tempDir}`);
      cleanupInDir(tempDir);
    }
  })();
  
  process.on('SIGINT', function() {
    cleanupInDir(tempDir);
    process.exit(0);
  });
}
else {
  const db = require('../db');
  const {parseRDFFile} = require('../lib');
  
  const Author = db.model('Author');
  const Book = db.model('Book');
  const BookAuthor = db.model('BookAuthor');
  
  (async () => {
    await db.connect();
    parentPort.postMessage('ready');
  })();
  
  parentPort.on('message', async (file) => {
    try {
      const rdfData = await parseRDFFile(file);
  
      const [book] = await Book.findOrCreate({
        raw: true,
        where: {
          external_id: rdfData.id,
        },
        defaults: {
          external_id: rdfData.id,
          title: rdfData.title,
          publisher: rdfData.publisher,
          published_at: rdfData.published,
          language: rdfData.language,
          rights: rdfData.rights
        }
      });
  
      for (let author of rdfData.authors) {
        [author] = await Author.findOrCreate({
          raw: true,
          where: {
            external_id: author.id,
          },
          defaults: {
            external_id: author.id,
            name: author.name,
          }
        });
    
        await BookAuthor.create({
          book_id: book.id,
          author_id: author.id,
        }, {ignoreDuplicates: true});
      }
    }
    catch {}
    finally {
      parentPort.postMessage('done');
    }
  });
}

