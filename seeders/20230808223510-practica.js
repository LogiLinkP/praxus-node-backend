'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

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
        resumen: 'hice muchas cosas',
        indice_repeticion: 0.7,
        key_repeticiones: 'aca estan los textos que se repiten',
        key_fragmentos: 'estos son los fragmentos que mas influyen en la consistencia'

      },
      {
        id: 2,
        id_estudiante: 2,
        id_config_practica: 2,
        id_supervisor: 2,
        id_empresa: 2,
        id_encargado: 2,
        id_modalidad: 3,
        estado: 'En curso',
        fecha_inicio: '2023-07-11 23:59:59'
      }
      
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('practica', null, {});
  }
};
