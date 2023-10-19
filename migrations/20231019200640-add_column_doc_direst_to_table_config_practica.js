'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn('config_practica', 'doc_direst', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn('config_practica', 'doc_direst');
  }
};
