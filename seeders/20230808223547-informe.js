'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('informe', [
      {
        id_practica: 1,
        id_config_informe: 1,
        horas_trabajadas: 0,
        key : 'aca esta el informe'
      },
      {
        id_practica: 2,
        id_config_informe: 2,
        horas_trabajadas: 0,
        key : 'aca esta el informe'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('informe', null, {});
  }
};
