'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('practica', 'calificacion_empresa', Sequelize.INTEGER);
    await queryInterface.addColumn('practica', 'comentario_empresa', Sequelize.STRING);
    return;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('practica', 'calificacion_empresa');
    await queryInterface.removeColumn('practica', 'comentario_empresa');
    return;
  }
};
