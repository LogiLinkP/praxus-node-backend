'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('mensaje', [
      {
        id: 1,
        id_chat: 1,
        emisor: 'encargado',
        texto: 'Buenas tardes, ¿en qué puedo ayudarle?',
        fecha: '2021-08-12 16:10:48'

      },
      {
        id: 2,
        id_chat: 1,
        emisor: 'estudiante',
        texto: 'Hola, soy el Ignacio y tengo una duda',
        fecha: '2021-08-12 16:09:48'
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mensaje', null, {});
  }
};
