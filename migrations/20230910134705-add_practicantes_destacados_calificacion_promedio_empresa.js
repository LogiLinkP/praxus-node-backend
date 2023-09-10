'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresa', 'practicantes_destacados', Sequelize.FLOAT);
    await queryInterface.addColumn('empresa', 'calificacion_promedio', Sequelize.FLOAT);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('empresa', 'practicantes_destacados');
    await queryInterface.removeColumn('empresa', 'calificacion_promedio');
    return;
  }
};
