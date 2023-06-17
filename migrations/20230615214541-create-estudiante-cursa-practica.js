'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estudiante_cursa_practica', {
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
      id_estudiante: {
        allowNull: false,
        type: Sequelize.INTEGER
        /*
        references: {
          model: 'estudiante',
          key: 'id'
        }
        */
      },
      estado: {
        type: Sequelize.STRING
      },
      nombre_supervisor: {
        type: Sequelize.STRING
      },
      correo_supervisor: {
        type: Sequelize.STRING
      },
      nombre_empresa: {
        type: Sequelize.STRING
      },
      rut_empresa: {
        type: Sequelize.STRING
      },
      fecha_incio: {
        type: Sequelize.STRING
      },
      fecha_termino: {
        type: Sequelize.STRING
      },
      nota_evaluacion: {
        type: Sequelize.INTEGER
      },
      consistencia_informe: {
        type: Sequelize.INTEGER
      },
      consistencia_nota: {
        type: Sequelize.INTEGER
      },
      key_informe_supervisor: {
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
    await queryInterface.dropTable('estudiante_cursa_practica');
  }
};