const fs = require('fs').promises;
const path = require('path');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

const {createTempDir} = require('../lib');

describe('Temp dir creator', function(){
  let tempDir;
  
  it('creates temporary directory in samples directory', async () => {
    const samplesDir = __dirname + '/samples';
    tempDir = await createTempDir(samplesDir);
    expect(path.dirname(tempDir)).to.be.equal(samplesDir);
  });
  
  afterEach(async function() {
    try {
      await fs.rmdir(tempDir, {recursive: true});
    } catch {}
  });
});