'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('estudiante', 'id_carrera', Sequelize.INTEGER);
    await queryInterface.addColumn('estudiante', 'perfil_linkedin', Sequelize.STRING);
    await queryInterface.addColumn('estudiante', 'empresa_destacada', Sequelize.BOOLEAN);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('estudiante', 'id_carrera');
    await queryInterface.removeColumn('estudiante', 'perfil_linkedin');
    await queryInterface.removeColumn('estudiante', 'empresa_destacada');
    return;
  }
};
