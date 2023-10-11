'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('publicacions', 'fecha_programada', Sequelize.DATE);
    return;
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('publicacions', 'fecha_programada');
    return;
  }
};
