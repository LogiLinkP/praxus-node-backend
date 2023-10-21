'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresa', 'ramos_utiles', Sequelize.JSON);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('empresa', 'ramos_utiles');
    return;
  }
};
