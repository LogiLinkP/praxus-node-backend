'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_informe', [
      {
        id_config_informe: 1,
        enunciado: '¿Qué tal estuvo el avance de la práctica?',
        tipo_respuesta: 'abierta'
      },
      {
        id_config_informe: 2,
        enunciado: '¿Resume el trabajo en tu práctica?',
        tipo_respuesta: 'abierta'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pregunta_informe', null, {});
  }
};
