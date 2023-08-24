'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('informe', 'key', Sequelize.JSON)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('informe', 'key', Sequelize.STRING)
  }
};
