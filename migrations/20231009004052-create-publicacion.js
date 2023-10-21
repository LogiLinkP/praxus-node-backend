'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('publicacions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_encargado: {
                type: Sequelize.INTEGER
            },
            id_carrera: {
                type: Sequelize.INTEGER
            },
            titulo: {
                type: Sequelize.STRING
            },
            enunciado: {
                type: Sequelize.STRING
            },
            fecha: {
                type: Sequelize.DATE
            },
            isfijo: {
                type: Sequelize.BOOLEAN
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('publicacions');
    }
};