'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('config_informe', [
      {
        id_config_practica: 1,
        tipo_informe: 'informe final',
      },
      {
        id_config_practica: 1,
        tipo_informe: 'informe avance'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('config_informe', null, {});
  }
};