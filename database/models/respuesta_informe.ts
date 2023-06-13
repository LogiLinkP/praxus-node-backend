export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const respuesta_informe = sequelize.define('respuesta_informe', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_informe: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = respuesta_informe;