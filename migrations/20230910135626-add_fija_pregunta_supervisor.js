'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pregunta_supervisor', 'fija', Sequelize.BOOLEAN);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pregunta_supervisor', 'fija');
    return;
  }
};
