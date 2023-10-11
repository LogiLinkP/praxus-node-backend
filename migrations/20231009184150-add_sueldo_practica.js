'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('practica', 'sueldo', Sequelize.INTEGER);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('practica', 'sueldo');
    return;
  }
};
