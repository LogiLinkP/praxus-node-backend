'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('mensaje', [
      {
        id_chat: 1,
        emisor: 'encargado',
        texto: 'Hola, soy el encargado',
        fecha: '2021-08-12 16:07:48'

      },
      {
        id_chat: 1,
        emisor: 'alumno',
        texto: 'Hola, soy el alumno',
        fecha: '2021-08-12 16:09:48'
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mensaje', null, {});
  }
};
