'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('INSERT INTO usuario (correo,password,nombre,es_encargado,es_supervisor,es_estudiante,es_admin) VALUES ("encargado1@gmail.com","123456","encargado1",1,0,0,0);');
    await queryInterface.sequelize.query('INSERT INTO usuario (correo,password,nombre,es_encargado,es_supervisor,es_estudiante,es_admin) VALUES ("encargado2@gmail.com","123456","encargado2",1,0,0,0);');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
