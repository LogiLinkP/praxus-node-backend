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
        respuesta: 'El estudiante se dedicó principalmente al desarrollo de una plataforma web, basada en Angular, para la gestión de proyectos de investigación.'
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
        respuesta: 'El estudiante hizo un sistema para leer el estado de los sensores de una planta de tratamiento de aguas servidas.'
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
