const Sequelize = require('sequelize');

const BookAuthorSchema = {
  fields: {
    book_id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    author_id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  removeAttributes: ['id'],
  options: {
    tableName: 'book_authors',
    timestamps: false,
    underscored: true,
  },
  relations: [
    {type: 'belongsTo', target: 'Book', as: 'book'},
    {type: 'belongsTo', target: 'Author', as: 'author'},
  ],
}

module.exports = BookAuthorSchema;