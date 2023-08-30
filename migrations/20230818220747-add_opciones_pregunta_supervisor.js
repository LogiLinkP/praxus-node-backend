'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('pregunta_supervisor', 'opciones', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('pregunta_supervisor', 'opciones');
  }
};
