export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const usuario = sequelize.define('usuario', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_estudiante: { // NULL en caso de ser encargado
        type: DataTypes.INTEGER,
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_usuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = usuario;