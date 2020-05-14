const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');
const tar = require('tar');

function extractRDFArchive(archiveFilePath) {
  return new Promise((resolve, reject) => {
    if (!path.basename(archiveFilePath).endsWith('.tar.zip')) {
      throw new Error('Archive does not have .tar.zip extension');
    }
    
    fs.createReadStream(archiveFilePath)
      .pipe(unzip.Extract({path: path.dirname(archiveFilePath)}))
      .on('error', reject)
      .on('finish', () => {
        const tarFile = path.join(
          path.dirname(archiveFilePath),
          path.basename(archiveFilePath, '.tar.zip')+'.tar'
        );
        fs.createReadStream(tarFile)
          .pipe(tar.extract({ cwd: path.dirname(archiveFilePath) }))
          .on('error', reject)
          .on('finish', () => {
            resolve();
          })
      });
  });
}

module.exports = extractRDFArchive;