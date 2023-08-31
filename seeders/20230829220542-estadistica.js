'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('estadistica', [
      {
        id: 1,
        id_config_practica: 1,
        pregunta_respuestas: '{"array":[1,"Evalúe la empresa entre 1 y 5","1",0,"2",0,"3",0,"4",0,"5",100]}'
      },
      {
        id: 2,
        id_config_practica: 2,
        pregunta_respuestas: '{"array":[2,"Evalúe la empresa entre 1 y 5","1",0,"2",0,"3",50,"4",0,"5",50]}'
      },
      {
        id: 3,
        id_config_practica: 2,
        pregunta_respuestas: '{"array":[2,"Seleccione los ramos que le fueron mas utiles durante su práctica","programacion",50,"talf",50,"lenguajes de programacion",100,"bases de datos",0,"redes",50]}',
      }

    ], {});


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('estadistica', null, {});
  }
};
