'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('config_practica', 'informe_final', Sequelize.STRING(2))
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('config_practica', 'informe_final', Sequelize.STRING(2))
  }
};
