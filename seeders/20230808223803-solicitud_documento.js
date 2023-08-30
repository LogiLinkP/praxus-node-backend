'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('solicitud_documento', [
      {
        id: 1,
        id_config_practica: 1,
        nombre_solicitud: 'Contrato firmado de la empresa',
        descripcion: 'Por favor, se solicita el contrato firmado de la empresa en formato pdf o png.',
        tipo_archivo:'pdf,png'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('solicitud_documento', null, {});
  }
};
