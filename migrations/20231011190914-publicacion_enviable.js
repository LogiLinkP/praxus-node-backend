'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('publicacions', 'enviable', Sequelize.BOOLEAN);
    return;
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('publicacions', 'enviable');
    return;
  }
};
