'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('encargado', 'id_carrera', Sequelize.INTEGER);
    await queryInterface.addColumn('encargado', 'practica_pendiente', Sequelize.JSON);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('encargado', 'id_carrera');
    await queryInterface.removeColumn('encargado', 'practica_pendiente');
    return;
  }
};
