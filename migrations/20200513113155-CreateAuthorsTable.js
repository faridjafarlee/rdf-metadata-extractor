module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('authors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      external_id: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false
      }
    }).then(async () => {
      await queryInterface.addIndex('authors', ['name'], {
        type: 'FULLTEXT',
        name: 'idx_name_fulltext',
      });
      await queryInterface.addIndex('authors', ['external_id'], {
        name: 'idx_external_id',
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
    Delete tables manually!
      DROP TABLE authors;
    */
  }
};
