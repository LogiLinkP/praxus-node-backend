'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_encuesta_final', [
      {
        id_config_practica: 1,
        enunciado: 'Evalue la empresa entre 1 y 5',
        tipo_respuesta: 'abierta'
      },
      {
        id_config_practica: 1,
        enunciado: '¿Que tanto sintio que le sirvieron los conocimientos aprendidos para rendir en su practica?',
        tipo_respuesta: 'abierta'
      },
      {
        id_config_practica: 2,
        enunciado: 'Evalue la empresa entre 1 y 5',
        tipo_respuesta: 'abierta'
      },
      {
        id_config_practica: 2,
        enunciado: '¿Que tanto sintio que le sirvieron los conocimientos aprendidos para rendir en su practica?',
        tipo_respuesta: 'abierta'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pregunta_encuesta_final', null, {});
  }
};
