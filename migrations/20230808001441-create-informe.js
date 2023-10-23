'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('informe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_practica: {
        type: Sequelize.INTEGER
      },
      id_config_informe: {
        type: Sequelize.INTEGER
      },
      horas_trabajadas: {
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.JSON
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('informe');
  }
};