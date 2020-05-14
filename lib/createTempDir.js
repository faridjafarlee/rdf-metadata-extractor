const fs = require('fs').promises;
const path = require('path');

async function createTempDir(prefixPath) {
  const tempDir = path.join(prefixPath, 'tmp-'+Date.now());
  await fs.mkdir(tempDir, {recursive: true});
  return tempDir;
}

module.exports = createTempDir;