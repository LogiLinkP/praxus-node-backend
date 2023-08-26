'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pregunta_supervisor', [
      {
        id: 1,
        id_config_practica: 1,
        enunciado: 'Evalúe al practicante entre 1 y 5 de acuerdo con su desempeño general',
        tipo_respuesta: 'evaluacion',
        opciones: ''
      },
      {
        id: 2,
        id_config_practica: 1,
        enunciado: 'Resuma las actividades del practicante',
        tipo_respuesta: 'abierta',
        opciones: ''
      },
      {
        id: 3,
        id_config_practica: 1,
        enunciado: 'Seleccione las características que mejor describen al practicante',
        tipo_respuesta: 'casillas',
        opciones: 'Esforzado;;Responsable;;Amistoso;;Puntual;;Respetuoso;;Trabajador'
      },
      {
        id: 4,
        id_config_practica: 1,
        enunciado: '¿Consideraría contratar a este practicante una vez terminada su práctica?',
        tipo_respuesta: 'alternativas',
        opciones: 'Sí;;No;;No sé'
      },
      {
        id: 5,
        id_config_practica: 2,
        enunciado: 'Evalúe al practicante entre 1 y 5 de acuerdo con su desempeño general',
        tipo_respuesta: 'evaluacion'
      },
      {
        id: 6,
        id_config_practica: 2,
        enunciado: 'Resuma las actividades del practicante',
        tipo_respuesta: 'abierta'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pregunta_supervisor', null, {});
  }
};
