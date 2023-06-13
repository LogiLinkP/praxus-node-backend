export {};

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../db');

const estudiante_cursa_practica = sequelize.define('estudiante_cursa_practica', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_practica: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_supervisor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre_empresa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rut_empresa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_termino: {
        type: DataTypes.DATE,
    },
    nota: {
        type: DataTypes.INTEGER,
    },
    consistencia: {
        type: DataTypes.INTEGER,
    }
  }, {
    freezeTableName: true, //el nombre de la tabla será igual al nombre del modelo
    timestamps: false //no agrega los atributos de timestamp a las tablas
  });

module.exports = estudiante_cursa_practica;