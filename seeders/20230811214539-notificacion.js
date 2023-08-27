'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('notificacion', [
    ], {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('notificacion', null, {});
  }
};
