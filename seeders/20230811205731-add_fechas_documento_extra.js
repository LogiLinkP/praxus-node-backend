'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('UPDATE documento_extra SET fecha_solicitud = "2023-06-11 23:59:59" WHERE id = 1;');
    await queryInterface.sequelize.query('UPDATE documento_extra SET fecha_subida = "2023-06-07 21:59:59" WHERE id = 1;');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
