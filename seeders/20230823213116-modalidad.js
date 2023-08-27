'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('modalidad', [
      {
        id: 1,
        id_config_practica: 1,
        tipo_modalidad: 'meses',
        cantidad_tiempo: 1
      },
      {
        id: 2,
        id_config_practica: 1,
        tipo_modalidad: 'meses',
        cantidad_tiempo: 2
      },
      {
        id: 3,
        id_config_practica: 2,
        tipo_modalidad: 'meses',
        cantidad_tiempo: 2
      },
      {
        id: 4,
        id_config_practica: 2,
        tipo_modalidad: 'meses',
        cantidad_tiempo: 1
      },
      {
        id: 5,
        id_config_practica: 2,
        tipo_modalidad: 'horas',
        cantidad_tiempo: 180
      },
      {
        id: 6,
        id_config_practica: 2,
        tipo_modalidad: 'horas',
        cantidad_tiempo: 360
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('modalidad', null, {});
  }
};
