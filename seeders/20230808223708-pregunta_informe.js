'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_informe', [
      {
        id: 1,
        id_config_informe: 1,
        enunciado: 'Resuma el trabajo que usted realizó en su práctica.',
        tipo_respuesta: 'abierta'
      },
      {
        id: 2,
        id_config_informe: 2,
        enunciado: '¿Qué tareas realizó usted hoy?',
        tipo_respuesta: 'abierta'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pregunta_informe', null, {});
  }
};
