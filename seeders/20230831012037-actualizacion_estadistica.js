'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('actualizacion_estadistica', [{
      id: 1,
      dia_actualizacion: 3
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('actualizacion_estadistica', null, {});
  }
};
