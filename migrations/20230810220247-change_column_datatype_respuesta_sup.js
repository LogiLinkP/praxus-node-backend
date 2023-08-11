'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('respuesta_supervisor', 'respuesta', Sequelize.STRING(16000))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('respuesta_supervisor', 'respuesta', Sequelize.STRING(16000))
  }
};
