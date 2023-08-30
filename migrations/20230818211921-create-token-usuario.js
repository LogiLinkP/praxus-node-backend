'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('token_usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING(141)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('token_usuarios');
  }
};