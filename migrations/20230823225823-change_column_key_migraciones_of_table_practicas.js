'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('practica', 'key_repeticiones', Sequelize.JSON)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('practica', 'key_repeticiones', Sequelize.STRING)
  }
};
