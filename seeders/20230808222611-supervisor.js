'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('supervisor', [
      {
        id: 1,
        nombre: 'supervisor1',
        correo: 'correo_supervisor1@gmail.com',
        carnet_rostro: false,
        es_correo_institucional: false
      },
      {
        id: 2,
        nombre: 'supervisor2',
        correo: 'correo_supervisor2@gmail.com',
        carnet_rostro: false,
        es_correo_institucional: false
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('supervisor', null, {});
     
  }
};
