'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plagio', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_practica: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_informe_origen: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_pregunta_informe_origen: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_informe_plagio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_pregunta_informe_plagio: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plagio');
  }
};