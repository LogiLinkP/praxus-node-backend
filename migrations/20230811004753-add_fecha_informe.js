'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('informe', 'fecha', Sequelize.DATE);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('informe', 'fecha');
  }
};
