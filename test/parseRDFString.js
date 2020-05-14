const fs = require('fs').promises;
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

const {parseRDFString} = require('../lib');

describe('RDF String Parser', function(){
  it('throws error if string is not valid RDF string', async () => {
    const invalidRDFString = '<rdf>I am invalid RDF string</rdf>';
    const promise = parseRDFString(invalidRDFString);
    await expect(promise).to.be.rejectedWith(Error);
  });
  
  it('throws error if string does not contain book info', async () => {
    const invalidRDFString = `
    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xml:base="http://www.gutenberg.org/"
      xmlns:pgterms="http://www.gutenberg.org/2009/pgterms/"
      xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:cc="http://web.resource.org/cc/"
      xmlns:dcterms="http://purl.org/dc/terms/"
      xmlns:dcam="http://purl.org/dc/dcam/"
    >
    </rdf:RDF>
    `;
    const promise = parseRDFString(invalidRDFString);
    await expect(promise).to.be.rejectedWith(Error);
  });
  
  it('it successfully parses proper RDF string', async () => {
    const sampleRDFFile = __dirname + '/samples/pg1.rdf';
    const sampleRDFDataAsJSON = require(__dirname + '/samples/pg1.json');
    const stringFromSampleRDFFile = await fs.readFile(sampleRDFFile);
    
    const promise = parseRDFString(stringFromSampleRDFFile);
    await expect(promise).eventually.to.deep.equal(sampleRDFDataAsJSON);
  });
});