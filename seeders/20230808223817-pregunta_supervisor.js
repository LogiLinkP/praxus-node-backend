'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_supervisor', [
      {
        id: 1,
        id_config_practica: 1,
        enunciado: 'Evalue al practicante entre 1 y 5',
        tipo_respuesta: 'evaluacion',
        opciones: ''
      },
      {
        id: 2,
        id_config_practica: 1,
        enunciado: '¿Resuma el trabajo del practicante?',
        tipo_respuesta: 'abierta',
        opciones: ''
      },
      {
        id: 3,
        id_config_practica: 1,
        enunciado: '¿Resuma el trabajo del practicante?',
        tipo_respuesta: 'casillas',
        opciones: 'casilla1;;casilla2;;casilla3'
      },
      {
        id: 4,
        id_config_practica: 1,
        enunciado: '¿Resuma el trabajo del practicante?',
        tipo_respuesta: 'alternativas',
        opciones: 'alernativa1;;alternativa2;;alternativa3'
      },
      {
        id: 5,
        id_config_practica: 2,
        enunciado: 'Evalue al practicante entre 1 y 5',
        tipo_respuesta: 'evaluacion'
      },
      {
        id: 6,
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
