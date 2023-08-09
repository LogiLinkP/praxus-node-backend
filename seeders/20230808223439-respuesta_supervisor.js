'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('respuesta_supervisor', [
      {
        id_pregunta_supervisor: 1,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '5'
      },
      {
        id_pregunta_supervisor: 2,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: 'Lo hizo bien'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('respuesta_supervisor', null, {});
  }
};
