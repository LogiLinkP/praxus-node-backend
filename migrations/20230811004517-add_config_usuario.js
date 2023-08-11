'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('usuario', 'config', Sequelize.STRING(65000));
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.addColumn('usuario', 'config', Sequelize.STRING(65000));
  }
};
