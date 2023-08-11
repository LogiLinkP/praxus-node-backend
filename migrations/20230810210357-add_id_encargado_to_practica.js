'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('practica', 'id_encargado', Sequelize.INTEGER);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('practica', 'id_encargado');
  }
};
