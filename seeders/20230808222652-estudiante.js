'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('estudiante', [
      {
        id: 1,
        id_usuario: 1,
        nombre_id_org: 'rol',
        id_org: '201873001-1',
        rut: '20134001-1',
      },
      {
        id: 2,
        id_usuario: 2,
        nombre_id_org: 'rol',
        id_org: '201773002-2',
        rut: '20123123-2',
      },
      {
        id: 3,
        id_usuario: 3,
        nombre_id_org: 'rol',
        id_org: '201373002-2',
        rut: '20258231-5',
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('estudiante', null, {});
  }
};
