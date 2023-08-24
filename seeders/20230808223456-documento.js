'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('documento', [
      {
        id: 1,
        id_practica: 1,
        id_solicitud_documento: 1,
        key: 'aqui esta el documento',
        fecha_subida: '2021-08-10 01:00:00'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('documento', null, {});
  }
};
