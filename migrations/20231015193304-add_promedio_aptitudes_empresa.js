'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresa', 'promedio_aptitudes', Sequelize.JSON);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('empresa', 'promedio_aptitudes');
    return;
  }
};
