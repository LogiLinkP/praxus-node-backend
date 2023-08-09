'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('documento_extra', [
      {
        id_practica: 1,
        nombre_solicitud: 'boleta',
        descripcion: 'por favor subir boleta',
        tipo_archivo:'pdf',
        key: 'aqui esta el documento'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('documento_extra', null, {});
  }
};
