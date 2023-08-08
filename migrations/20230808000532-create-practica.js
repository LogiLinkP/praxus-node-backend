'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('practica', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_estudiante: {
        type: Sequelize.INTEGER
      },
      id_config_practica: {
        type: Sequelize.INTEGER
      },
      id_supervisor: {
        type: Sequelize.INTEGER
      },
      id_empresa: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.STRING
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_termino: {
        type: Sequelize.DATE
      },
      nota_eval: {
        type: Sequelize.FLOAT
      },
      consistencia_informe: {
        type: Sequelize.FLOAT
      },
      consistencia_nota: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('practica');
  }
};