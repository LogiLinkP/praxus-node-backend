'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('informe', [
      {
        id: 1,
        id_practica: 1,
        id_config_informe: 1,
        horas_trabajadas: 0,
        fecha: '2023-06-11 23:59:59',
        key : '{"1": "Yo participé de dos etapas principales, la primera ligada a la adquisición de conocimientos, herramientas y manejo de stack utilizado al interior de la empresa. Y la segunda orientada a participar en proyectos en proceso de desarrollo, con la toma de requerimientos a nivel de backend y frontend."}'
      },
      {
        id: 2,
        id_practica: 2,
        id_config_informe: 2,
        horas_trabajadas: 0,
        fecha: '2023-06-11 23:59:59',
        key : '{"2": "YO participé de dos etapas principales, la primera ligada a la adquisición de conocimientos, herramientas y manejo de stack utilizado al interior de la empresa. Y la segunda orientada a participar en proyectos en proceso de desarrollo, con la toma de requerimientos a nivel de backend y frontend."}'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('informe', null, {});
  }
};
