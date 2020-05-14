const _ = require('lodash');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

async function parseRDFString(rdfString) {
  const {'rdf:RDF': rdfData} = await parser.parseStringPromise(rdfString);
  if (!rdfData) throw new Error('Invalid RDF string');
  
  const bookData = _.get(rdfData, 'pgterms:ebook.0');
  if (!bookData || _.isEmpty(bookData)) throw new Error('Invalid Book data');
  
  return {
    id: _.get(bookData, '$.rdf:about').split('/')[1],
    title: _.get(bookData, 'dcterms:title.0'),
    authors: [
      {
        id: _.get(bookData, 'dcterms:creator.0.pgterms:agent.0.$.rdf:about').split('/')[2],
        name: _.get(bookData, 'dcterms:creator.0.pgterms:agent.0.pgterms:name.0'),
      }
    ],
    publisher: _.get(bookData, 'dcterms:publisher.0'),
    published: _.get(bookData, 'dcterms:issued.0._'),
    language: _.get(bookData, 'dcterms:language.0.rdf:Description.0.rdf:value.0._'),
    rights: _.get(bookData, 'dcterms:rights.0'),
  };
}

module.exports = parseRDFString;