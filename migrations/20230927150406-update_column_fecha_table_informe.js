'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('informe', 'fecha', {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now')})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('informe', 'fecha', {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now')})
  }
};
