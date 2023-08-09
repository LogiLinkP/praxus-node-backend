'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('empresa', [
      {
        nombre_empresa: 'empresa 1',
        rut_empresa: '123456789',
        empresa_verificada: false,
        dominios_empresa: '@empresa1.cl'
      },
      {
        nombre_empresa: 'empresa 2',
        rut_empresa: '987654321',
        empresa_verificada: false,
        dominios_empresa: '@empresa2.cl'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('empresa', null, {});
  }
};
