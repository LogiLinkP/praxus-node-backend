'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carrera', 'sueldo_promedio', Sequelize.INTEGER);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('carrera', 'sueldo_promedio');
    return;
  }
};
