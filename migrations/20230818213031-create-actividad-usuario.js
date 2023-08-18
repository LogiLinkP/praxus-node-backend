'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('actividad_usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER
      },
      accion: {
        type: Sequelize.STRING(100)
      },
      fecha: {
        type: Sequelize.DATE
      },
      useragent: {
        type: Sequelize.STRING(256)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('actividad_usuarios');
  }
};