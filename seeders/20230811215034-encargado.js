'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('encargado', [
      {
        id: 1,
        id_usuario: 4
      },
      {
        id: 2,
        id_usuario: 5
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('encargado', null, {});
  }
};
