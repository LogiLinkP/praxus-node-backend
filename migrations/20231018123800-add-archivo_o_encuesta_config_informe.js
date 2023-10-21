'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('config_informe', 'archivo_o_encuesta', Sequelize.STRING);
    await queryInterface.addColumn('config_informe', 'tipo_archivo', Sequelize.STRING);
    await queryInterface.addColumn('config_informe', 'plantilla', Sequelize.STRING);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('config_practica', 'sueldo_promedio');
    await queryInterface.removeColumn('config_informe', 'archivo_o_encuesta');
    await queryInterface.removeColumn('config_informe', 'tipo_archivo');
    return;
  }
};
