module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('book_authors', {
      book_id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      author_id: {
        type: Sequelize.UUID,
        primaryKey: true,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
    Delete tables manually!
      DROP TABLE book_authors;
    */
  }
};
