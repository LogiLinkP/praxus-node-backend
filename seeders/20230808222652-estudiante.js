'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('estudiante', [
      {
        id_usuario: 1,
        nombre_id_org: 'rol',
        id_org: '201773001-1',
        rut: '2013001-1',
      },
      {
        id_usuario: 2,
        nombre_id_org: 'rol',
        id_org: '201773002-2',
        rut: '2013002-2',
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('estudiante', null, {});
  }
};
