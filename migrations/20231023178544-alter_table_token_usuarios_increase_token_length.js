'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.changeColumn('token_usuarios', 'token', {
      type: Sequelize.STRING(200)
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.changeColumn('token_usuarios', 'token', {
      type: Sequelize.STRING(141)
    });    
  }
};
