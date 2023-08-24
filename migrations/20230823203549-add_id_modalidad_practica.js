'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.addColumn('practica', 'id_modalidad', {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn('practica', 'id_modalidad');
  }
};
