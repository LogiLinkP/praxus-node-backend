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
      id_config_informe: {
        allowNull: false,
        type: Sequelize.INTEGER
        /*
        references: {
          model: 'informe',
          key: 'id'
        }
        */
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
      key: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('informe');
  }
};