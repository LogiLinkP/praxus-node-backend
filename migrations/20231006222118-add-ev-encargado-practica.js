'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('practica', 'ev_encargado', Sequelize.STRING);
    return;
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('practica', 'ev_encargado');
    return;
  }
};