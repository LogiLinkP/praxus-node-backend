'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documento_extra', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_practica: {
        type: Sequelize.INTEGER
      },
      nombre_solicitud: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.STRING
      },
      tipo_archivo: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('documento_extra');
  }
};