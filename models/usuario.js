'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usuario.init({
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    nombre: DataTypes.STRING,
    es_encargado: DataTypes.BOOLEAN,
    es_supervisor: DataTypes.BOOLEAN,
    es_estudiante: DataTypes.BOOLEAN,
    es_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuario'
  });
  return usuario;
};