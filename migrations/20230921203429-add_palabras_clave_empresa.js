'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresa', 'palabras_clave', Sequelize.STRING);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('empresa', 'palabras_clave');
    return;
  }
};
