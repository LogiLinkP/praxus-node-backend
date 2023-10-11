'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('config_practica', 'sueldo_promedio', Sequelize.INTEGER);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('config_practica', 'sueldo_promedio');
    return;
  }
};
