'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuario', 'activado', Sequelize.BOOLEAN);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuario', 'activado');
    return;
  }
};
