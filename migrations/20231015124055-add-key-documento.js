'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('documento_encargado', 'key', Sequelize.STRING);
    return;
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('documento_encargado', 'key');
    return;
  }
};