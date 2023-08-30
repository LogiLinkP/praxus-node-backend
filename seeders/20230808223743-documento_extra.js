'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('documento_extra', [
      {
        id: 1,
        id_practica: 1,
        nombre_solicitud: 'Boleta de honorarios',
        descripcion: 'Se requiere la boleta de honorarios de la empresa en formato pdf.',
        tipo_archivo:'pdf',
        key: 'boletaHonorarios.pdf',
        fecha_solicitud: '2021-08-08 01:00:00',
        fecha_subida: '2021-08-09 02:00:00'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('documento_extra', null, {});
  }
};
