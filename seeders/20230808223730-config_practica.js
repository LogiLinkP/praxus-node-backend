'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('config_practica', [
      {
        nombre: 'practica profesional',
        modalidad: 'meses',
        cantidad_tiempo: 1,
        frecuencia_informes: 'ninguna',
        informe_final: true,
      },
      {
        nombre: 'practica industrial',
        modalidad: 'meses',
        cantidad_tiempo: 2,
        frecuencia_informes: 'semanal',
        informe_final: false,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('config_practica', null, {});
  }
};
