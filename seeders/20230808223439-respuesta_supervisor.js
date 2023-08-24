'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('respuesta_supervisor', [
      {
        id: 1,
        id_pregunta_supervisor: 1,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '5'
      },
      {
        id: 2,
        id_pregunta_supervisor: 2,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: 'Lo hizo bien'
      },
      {
        id: 3,
        id_pregunta_supervisor: 3,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '1,0,1,0,0,0'
      },
      {
        id: 4,
        id_pregunta_supervisor: 4,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '1,0,0'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('respuesta_supervisor', null, {});
  }
};
