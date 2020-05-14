const db = require('../db');
const {parseRDFFile} = require('../lib');

const Author = db.model('Author');
const Book = db.model('Book');
const BookAuthor = db.model('BookAuthor');

(async () => {
  await db.connect();
  
  const files = process.argv.slice(2);
  
  for (const file of files) {
    let rdfData;
    try {
      rdfData = await parseRDFFile(file);
    }
    catch(error) {
      console.error(`Failed parsing: ${file} with message: ${error.message}`);
      console.log("\n----\n");
      continue;
    }
    
    console.log('File:', file);
    for(const field in rdfData) {
      console.log(field + ':', JSON.stringify(rdfData[field]));
    }
    console.log("\n----\n");
    
    const [book] = await Book.findOrCreate({
      raw: true,
      where: {
        external_id: rdfData.id,
      },
      defaults: {
        external_id: rdfData.id,
        title: rdfData.title,
        publisher: rdfData.publisher,
        published_at: rdfData.published,
        language: rdfData.language,
        rights: rdfData.rights
      }
    });
    
    for (let author of rdfData.authors) {
      [author] = await Author.findOrCreate({
        raw: true,
        where: {
          external_id: author.id,
        },
        defaults: {
          external_id: author.id,
          name: author.name,
        }
      });
      
      
      await BookAuthor.create({
        book_id: book.id,
        author_id: author.id,
      }, {ignoreDuplicates: true});
    }
  }
  
  await db.disconnect();
})();