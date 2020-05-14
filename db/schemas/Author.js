const Sequelize = require('sequelize');

const AuthorSchema = {
  fields: {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    external_id: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
  },
  removeAttributes: [],
  options: {
    tableName: 'authors',
    timestamps: false,
    underscored: true,
  },
  relations: [
    {type: 'belongsToManyThrough', target: 'Book', through: 'BookAuthor', as: 'books'},
  ],
}

module.exports = AuthorSchema;