'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('supervisor', [
      {
        id: 1,
        nombre: 'Jerry Caballero',
        correo: 'harold.caballero@sansano.usm.cl',
        carnet_rostro: false,
        es_correo_institucional: false
      },
      {
        id: 2,
        nombre: 'Henry Caballero',
        correo: 'harold.caballero@sansano.usm.cl',
        carnet_rostro: false,
        es_correo_institucional: false
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('supervisor', null, {});
     
  }
};
