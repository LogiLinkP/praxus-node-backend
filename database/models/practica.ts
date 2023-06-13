export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const practica = sequelize.define('practica', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_practica: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modalidad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    num_informes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cantidad_horas: {
      type: DataTypes.INTEGER,
    },
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = practica;