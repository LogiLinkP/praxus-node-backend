'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('practica', 'interpretacion_informe', Sequelize.STRING);
    await queryInterface.addColumn('practica', 'interpretacion_nota', Sequelize.STRING);
    return;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('practica', 'interpretacion_informe');
    await queryInterface.removeColumn('practica', 'interpretacion_nota');
    return;
  }
};
