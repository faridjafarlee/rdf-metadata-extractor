const db = require('../db');
const parseRDFFile = require('./parseRDFFile');
const Author = db.model('Author');
const Book = db.model('Book');
const BookAuthor = db.model('BookAuthor');

module.exports = async function(file) {
  const rdfData = await parseRDFFile(file);

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

    return rdfData;
  }
};