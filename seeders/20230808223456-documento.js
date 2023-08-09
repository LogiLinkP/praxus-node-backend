'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('documento', [
      {
        id_practica: 1,
        id_solicitud_documento: 1,
        key: 'aqui esta el documento'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('documento', null, {});
  }
};
