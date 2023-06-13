export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const pregunta = sequelize.define('pregunta', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Enunciado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_respuesta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_informe: {
      type: DataTypes.INTEGER,
    },
    id_practica: {
      type: DataTypes.INTEGER,
    }
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = pregunta;