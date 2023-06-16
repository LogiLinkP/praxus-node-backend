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
        allowNull: false,
        type: Sequelize.INTEGER
        /*
        references: {
          model: 'practica',
          key: 'id'
        }
        */
      },
      tipo_informe: {
        type: Sequelize.STRING
      },
      hora: {
        type: Sequelize.BOOLEAN
      },
      fecha: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('informe');
  }
};