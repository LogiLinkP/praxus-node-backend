'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.removeColumn('config_practica', 'cantidad_tiempo');
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.addColumn('config_practica', 'cantidad_tiempo', {
      type: Sequelize.INTEGER,
    });
  }
};
