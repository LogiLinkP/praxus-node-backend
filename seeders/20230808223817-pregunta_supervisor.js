'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_supervisor', [
      {
        id_config_practica: 1,
        enunciado: 'Evalue al practicante entre 1 y 5',
        tipo_respuesta: 'evaluacion'
      },
      {
        id_config_practica: 1,
        enunciado: '¿Resuma el trabajo del practicante?',
        tipo_respuesta: 'abierta'
      },
      {
        id_config_practica: 2,
        enunciado: 'Evalue al practicante entre 1 y 5',
        tipo_respuesta: 'evaluacion'
      },
      {
        id_config_practica: 2,
        enunciado: '¿Resuma el trabajo del practicante?',
        tipo_respuesta: 'abierta'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pregunta_supervisor', null, {});
  }
};
