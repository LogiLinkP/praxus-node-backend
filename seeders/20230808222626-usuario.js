'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('usuario', [
      {
        correo: 'correo_usuario1@gmail.com',
        password: '123456',
        nombre: 'usuario estudiante 1',
        es_encargado: false,
        es_supervisor: false,
        es_estudiante: true,
        es_admin: false
      },
      {
        correo: 'correo_usuario2@gmail.com',
        password: '123456',
        nombre: 'usuario estudiante 2',
        es_encargado: false,
        es_supervisor: false,
        es_estudiante: true,
        es_admin: false
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('usuario', null, {});

  }
};
