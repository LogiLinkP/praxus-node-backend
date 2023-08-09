'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class empresa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  empresa.init({
    nombre_empresa: DataTypes.STRING,
    rut_empresa: DataTypes.STRING,
    empresa_verificada: DataTypes.BOOLEAN,
    dominios_empresa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'empresa',
    tableName: 'empresa',
    timestamps: false
  });
  return empresa;
};