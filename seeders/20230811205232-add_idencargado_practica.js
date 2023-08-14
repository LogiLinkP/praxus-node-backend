'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('UPDATE practica SET id_encargado = 1 WHERE id = 1;');
    await queryInterface.sequelize.query('UPDATE practica SET id_encargado = 2 WHERE id = 2;');
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
