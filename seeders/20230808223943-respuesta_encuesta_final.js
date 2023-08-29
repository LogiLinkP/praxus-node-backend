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
      },
      {
        id_pregunta_encuesta_final: 3,
        respuesta: '0,0,0,0,1'
      },
      {
        id_pregunta_encuesta_final: 3,
        respuesta: '0,0,1,0,0'
      },
      {
        id_pregunta_encuesta_final: 4,
        respuesta: 'Me sirvieron mucho los conocimientos adquiridos'
      },
      {
        id_pregunta_encuesta_final: 4,
        respuesta: 'Me falto preparacion en algunos ambitos'
      },
      {
        id_pregunta_encuesta_final: 5,
        respuesta: '1,1,1,0,0'
      },
      {
        id_pregunta_encuesta_final: 5,
        respuesta: '0,0,1,0,1'
      }
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('respuesta_encuesta_final', null, {});
  }
};
