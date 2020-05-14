const fs = require("fs").promises;
const path = require("path");

async function getRDFFilesInDir(dir, files = []) {
  const entries = await fs.readdir(dir);
 
  for (const entry of entries) {
    const entryPath = path.join(dir, entry);
    const entryStat = await fs.stat(entryPath);

    if (entryStat.isDirectory()) {
      files = await getRDFFilesInDir(entryPath, files);
    }
  
    if (entryStat.isFile() && path.extname(entry) === '.rdf') {
      files.push(entryPath);
    }
  }
  
  return files;
}

module.exports = getRDFFilesInDir;