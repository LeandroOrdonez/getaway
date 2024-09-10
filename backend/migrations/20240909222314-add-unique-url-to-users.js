'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'uniqueUrl', {
      type: Sequelize.STRING,
      unique: true,
      after: 'isAdmin'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'uniqueUrl');
  }
};