'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notificacion', 'link', Sequelize.STRING);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notificacion', 'link');
    return;
  }
};
