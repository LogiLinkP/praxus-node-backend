'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pregunta_practica', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_practica: {
        allowNull: false,
        type: Sequelize.INTEGER
        /*
        references: {
          model: 'practica',
          key: 'id'
        }
        */
      },
      enunciado: {
        type: Sequelize.STRING
      },
      tipo_pregunta: {
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
    await queryInterface.dropTable('pregunta_practica');
  }
};