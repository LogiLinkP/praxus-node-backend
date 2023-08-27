'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('chat', [
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('chat', null, {});
  }
};
