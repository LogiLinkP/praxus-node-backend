'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aptitud', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_carrera: {
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      rango: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('aptitud');
  }
};