'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_estudiante_cursa_practica: {
        allowNull: false,
        type: Sequelize.INTEGER
        /*
        references: {
          model: 'estudiante_cursa_practica',
          key: 'id'
        }
        */
      },
      tipo: {
        type: Sequelize.STRING
      },
      key_documento: {
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
    await queryInterface.dropTable('documento');
  }
};