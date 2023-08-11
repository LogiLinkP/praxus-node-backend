'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('documento_extra', 'fecha_subida', Sequelize.DATE);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('documento_extra', 'fecha_subida');
  }
};
