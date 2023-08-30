'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('practica', [
      {
        id: 1,
        id_estudiante: 1,
        id_config_practica: 1,
        id_supervisor: 1,
        id_empresa: 1,
        id_encargado: 1,
        id_modalidad: 1,
        estado: 'Aprobada',
        fecha_inicio: '2023-06-11 23:59:59',
        fecha_termino: '2023-07-11 23:59:59',
        nota_eval: 90,
        consistencia_informe: 0.8,
        consistencia_nota: 0.9,
        resumen: null,
        indice_repeticion: 0.7,
        interpretacion_nota: "El puntaje de la evaluación es similar la detectada en el informe"
      },
      {
        id: 2,
        id_estudiante: 2,
        id_config_practica: 1,
        id_supervisor: 2,
        id_empresa: 2,
        id_encargado: 2,
        id_modalidad: 2,
        estado: 'En curso',
        fecha_inicio: '2023-07-11 23:59:59'
      },
      {
        id: 3,
        id_estudiante: 1,
        id_config_practica: 2,
        id_supervisor: 2,
        id_empresa: 2,
        id_encargado: 2,
        id_modalidad: 3,
        estado: 'En curso',
        fecha_inicio: '2023-07-11 23:59:59'
      },
      {
        id: 4,
        id_estudiante: 3,
        id_config_practica: 1,
        id_supervisor: 2,
        id_empresa: 2,
        id_encargado: 1,
        id_modalidad: 1,
        estado: 'Evaluada',
        fecha_inicio: '2023-07-11 23:59:59',
        interpretacion_nota: "El puntaje de la evaluación es similar la detectada en el informe"
      }

    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('practica', null, {});
  }
};
