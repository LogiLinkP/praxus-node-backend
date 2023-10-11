'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('respuesta_ramos', 'id_practica', Sequelize.INTEGER);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('respuesta_ramos', 'id_practica');
    return;
  }
};
