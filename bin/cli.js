const db = require('../db');
const importRDFFile = require('../lib/importRDFFile');

(async () => {
  await db.connect();
  
  const files = process.argv.slice(2);
  
  for (const file of files) {
    let rdfData;
    try {
      rdfData = await importRDFFile(file);
      console.log('File:', file);
      for(const field in rdfData) {
        console.log(field + ':', JSON.stringify(rdfData[field]));
      }
      console.log("\n----\n");
    }
    catch(error) {
      console.error(`Failed parsing: ${file} with message: ${error.message}`);
      console.log("\n----\n");
      continue;
    }
  }
  
  await db.disconnect();
})();