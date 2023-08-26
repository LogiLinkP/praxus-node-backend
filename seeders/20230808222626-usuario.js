'use strict';

const bcrypt = require('bcrypt');



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let hash1 = await bcrypt.hash("123123", 8)
    let hash2 = await bcrypt.hash("123123", 8)
    let hash3 = await bcrypt.hash("123123", 8)
    let hash4 = await bcrypt.hash("123123", 8)
    let hash5 = await bcrypt.hash("123123", 8)
    
    await queryInterface.bulkInsert('usuario', [
      {
        id: 1,
        correo: 'correo_usuario1@gmail.com',
        password: hash1,
        nombre: 'Ignacio Norambuena',
        es_encargado: false,
        es_supervisor: false,
        es_estudiante: true,
        es_admin: false
      },
      {
        id: 2,
        correo: 'correo_usuario2@gmail.com',
        password: hash2,
        nombre: 'Marcela Iturrieta',
        es_encargado: false,
        es_supervisor: false,
        es_estudiante: true,
        es_admin: false
      },
      {
        id: 3,
        correo: 'correo_usuario3@gmail.com',
        password: hash3,
        nombre: 'Jorge Pinto',
        es_encargado: true,
        es_supervisor: false,
        es_estudiante: true,
        es_admin: false
      },
      {
        id: 4,
        correo: 'correo_usuario4@gmail.com',
        password: hash4,
        nombre: 'Inés Martínez',
        es_encargado: true,
        es_supervisor: false,
        es_estudiante: false,
        es_admin: false
      },
      {
        id: 5,
        correo: 'correo_usuario5@gmail.com',
        password: hash5,
        nombre: 'Raúl Salazar',
        es_encargado: true,
        es_supervisor: false,
        es_estudiante: false,
        es_admin: false
      },


    ], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('usuario', null, {});

  }
};
