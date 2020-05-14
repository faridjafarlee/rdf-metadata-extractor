module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('books', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      publisher: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      published_at: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true
      },
      language: {
        type: Sequelize.DataTypes.STRING(2),
        allowNull: true
      },
      rights: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
      },
      external_id: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false
      }
    }).then(async () => {
      await queryInterface.addIndex('books', ['title'], {
        type: 'FULLTEXT',
        name: 'idx_title_fulltext',
      });
      await queryInterface.addIndex('books', ['published_at'], {
        name: 'idx_published_at',
      });
      await queryInterface.addIndex('books', ['external_id'], {
        name: 'idx_external_id',
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
    Delete tables manually!
      DROP TABLE books;
    */
  }
};
