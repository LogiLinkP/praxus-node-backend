'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documento_encargado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  documento_encargado.init({
    id_carrera: DataTypes.INTEGER,
    id_encargado: DataTypes.INTEGER,
    tipo: DataTypes.STRING,
    nombre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'documento_encargado',
    tableName: 'documento_encargado',
    timestamps: false
  });
  return documento_encargado;
};