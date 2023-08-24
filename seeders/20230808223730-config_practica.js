'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('config_practica', [
      {
        id: 1,
        nombre: 'Práctica Profesional',
        frecuencia_informes: 'sinAvance',
        informe_final: "si",
      },
      {
        id: 2,
        nombre: 'Práctica Industrial',
        frecuencia_informes: 'semanal',
        informe_final: "no",
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('config_practica', null, {});
  }
};
