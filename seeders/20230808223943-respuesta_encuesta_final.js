'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('respuesta_encuesta_final', [
      {
        id_pregunta_encuesta_final: 1,
        respuesta: '5'
      },
      {
        id_pregunta_encuesta_final: 2,
        respuesta: 'me sirvieron harto'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('respuesta_encuesta_final', null, {});
  }
};
