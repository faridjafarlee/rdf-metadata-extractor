const Sequelize = require('sequelize');

const BookSchema = {
  fields: {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    publisher: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    published_at: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    language: {
      type: Sequelize.STRING(2),
      allowNull: true,
    },
    rights: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    external_id: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
  },
  removeAttributes: [],
  options: {
    tableName: 'books',
    timestamps: false,
    underscored: true,
  },
  relations: [
    {type: 'belongsToManyThrough', target: 'Author', through: 'BookAuthor', as: 'authors'},
  ],
}

module.exports = BookSchema;