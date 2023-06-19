'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estudiante', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        allowNull: false,
        type: Sequelize.INTEGER
        /*
        references: {
          model: 'usuario',
          key: 'id'
        }
        */
      },
      nombre: {
        type: Sequelize.STRING
      },
      rol: {
        type: Sequelize.STRING
      },
      rut: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estudiante');
  }
};