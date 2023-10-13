'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carrera', 'sueldo_ramos', Sequelize.JSON);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('carrera', 'sueldo_ramos');
    return;
  }
};
