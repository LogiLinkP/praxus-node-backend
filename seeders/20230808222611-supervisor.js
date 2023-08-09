'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('supervisor', [
      {
        nombre: 'supervisor buena onda',
        correo: 'correo_supervisor1@gmail.com',
        carnet_rostro: false,
        es_correo_institucional: false
      },
      {
        nombre: 'supervisor mala onda',
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
