'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('notificacion', [
      {
        id: 1,
        id_usuario: 1,
        texto: 'esta es una notificacion de prueba',
        fecha: '2023-06-11 23:59:59'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('notificacion', null, {});
  }
};
