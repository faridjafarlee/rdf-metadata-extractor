const fs = require('fs').promises;
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

const {getRDFFilesInDir} = require('../lib');

describe('RDF Files Locator', function(){
  it('returns empty array if no files with .rdf extension', async () => {
    const emptyDir = __dirname + '/samples/empty-dir';
    const promise = getRDFFilesInDir(emptyDir);
    await expect(promise).eventually.to.be.an('array').that.is.empty;
  });
  
  it('returns list of files with .rdf extension', async () => {
    const emptyDir = __dirname + '/samples';
    const promise = getRDFFilesInDir(emptyDir);
    await expect(promise).eventually.to.be.an('array').that.is.not.empty;
  });
});