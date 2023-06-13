export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const estudiante = sequelize.define('estudiante', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = estudiante;