'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('usuario', 'config', Sequelize.TEXT);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('usuario', 'config');
  }
};
