'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_encuesta_final', [
      {
        id: 1,
        id_config_practica: 1,
        enunciado: 'Evalúe la empresa entre 1 y 5',
        tipo_respuesta: 'alternativas',
        opciones: '1;;2;;3;;4;;5'
      },
      {
        id: 2,
        id_config_practica: 1,
        enunciado: '¿Qué tanto sintió que le sirvieron los conocimientos aprendidos para rendir en su práctica?',
        tipo_respuesta: 'abierta'
      },
      {
        id: 3,
        id_config_practica: 2,
        enunciado: 'Evalúe la empresa entre 1 y 5',
        tipo_respuesta: 'alternativas',
        opciones: '1;;2;;3;;4;;5'
      },
      {
        id: 4,
        id_config_practica: 2,
        enunciado: '¿Qué tanto sintió que le sirvieron los conocimientos aprendidos para rendir en su práctica?',
        tipo_respuesta: 'abierta'
      },
      {
        id: 5,
        id_config_practica: 2,
        enunciado: 'Seleccione los ramos que le fueron mas utiles durante su práctica',
        tipo_respuesta: 'casillas',
        opciones: 'programacion;;talf;;lenguajes de programacion;;bases de datos;;sistemas operativos'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pregunta_encuesta_final', null, {});
  }
};
