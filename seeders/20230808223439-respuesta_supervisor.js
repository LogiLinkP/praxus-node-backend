'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('respuesta_supervisor', [
      {
        id: 1,
        id_pregunta_supervisor: 1,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '5'
      },
      {
        id: 2,
        id_pregunta_supervisor: 2,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: 'El estudiante participó de dos etapas principales, la primera ligada a la adquisición de conocimientos, herramientas y manejo de stack utilizado al interior de la empresa. Y la segunda orientada a participar en proyectos en proceso de desarrollo, con la toma de requerimientos a nivel de backend y frontend.'
      },
      {
        id: 3,
        id_pregunta_supervisor: 3,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '1,1,1,0,1,1'
      },
      {
        id: 4,
        id_pregunta_supervisor: 4,
        id_supervisor: 1,
        id_practica: 1,
        respuesta: '1,0,0'
      },
      {
        id: 5,
        id_pregunta_supervisor: 1,
        id_supervisor: 2,
        id_practica: 4,
        respuesta: '4'
      },
      {
        id: 6,
        id_pregunta_supervisor: 2,
        id_supervisor: 2,
        id_practica: 4,
        respuesta: 'Levantamiento y mejoras (automatización) de un proceso de gestión de KPI\'s que consistía en reestructurar la metodología para la obtención de datos, procesamiento y disposición final en un dashboard.'
      },
      {
        id: 7,
        id_pregunta_supervisor: 3,
        id_supervisor: 2,
        id_practica: 4,
        respuesta: '1,1,1,1,1,1'
      },
      {
        id: 8,
        id_pregunta_supervisor: 4,
        id_supervisor: 2,
        id_practica: 4,
        respuesta: '1,0,0'
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('respuesta_supervisor', null, {});
  }
};
