'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('solicitud_documento', [
      {
        id_config_practica: 1,
        nombre_solicitud: 'certificado empresa',
        descripcion: 'por favor subir certificado empresa',
        tipo_archivo:'pdf'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('solicitud_documento', null, {});
  }
};
