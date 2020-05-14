const fs = require('fs').promises;
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

const {parseRDFFile} = require('../lib');

describe('RDF File Parser', function(){
  it('throws error if file contains invalid RDF data', async () => {
    const invalidRDFFile = __dirname + '/samples/invalid.rdf';
    
    const promise = parseRDFFile(invalidRDFFile);
    await expect(promise).to.be.rejectedWith(Error);
  });
  
  it('throws error if RDF data does not have book info', async () => {
    const rdfFileWithEmptyBookData = __dirname + '/samples/empty-book.rdf';
    
    const promise = parseRDFFile(rdfFileWithEmptyBookData);
    await expect(promise).to.be.rejectedWith(Error);
  });
  
  it('it successfully parses proper RDF string', async () => {
    const sampleRDFFile = __dirname + '/samples/pg1.rdf';
    const sampleRDFDataAsJSON = require(__dirname + '/samples/pg1.json');

    const promise = parseRDFFile(sampleRDFFile);
    await expect(promise).eventually.to.deep.equal(sampleRDFDataAsJSON);
  });
});