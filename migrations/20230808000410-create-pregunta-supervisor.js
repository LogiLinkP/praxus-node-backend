'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pregunta_supervisor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_config_practica: {
        type: Sequelize.INTEGER
      },
      enunciado: {
        type: Sequelize.STRING
      },
      tipo_respuesta: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pregunta_supervisor');
  }
};