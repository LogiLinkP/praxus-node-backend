'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('usuario', 'config', Sequelize.JSON)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('usuario', 'config', Sequelize.STRING)
  }
};