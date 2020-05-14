const fs = require('fs').promises;

async function parseRDFFile(file, parse = require('./parseRDFString')) {
  try {
    const fileContents = await fs.readFile(file);
    return parse(fileContents);
  }
  catch {}
  return null;
}

module.exports = parseRDFFile;