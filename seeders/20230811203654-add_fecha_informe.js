'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('UPDATE informe SET fecha = "2023-06-11 23:59:59" WHERE id = 1;');
    await queryInterface.sequelize.query('UPDATE informe SET fecha = "2023-06-13 23:59:59" WHERE id = 2;');
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
