export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const informe = sequelize.define('informe', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_informe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: false
    },
    periodicidad: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = informe;