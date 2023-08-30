'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('respuesta_encuesta_final', [
      {
        id_pregunta_encuesta_final: 1,
        respuesta: '0,0,0,0,1'
      },
      {
        id_pregunta_encuesta_final: 2,
        respuesta: 'Me sirvieron mucho los conocimientos adquiridos'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('respuesta_encuesta_final', null, {});
  }
};
