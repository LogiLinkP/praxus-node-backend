'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('carrera', 'ramos', Sequelize.TEXT)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('carrera', 'ramos', Sequelize.TEXT)
  }
};
