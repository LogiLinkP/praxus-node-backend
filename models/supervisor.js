'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class supervisor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  supervisor.init({
    id_usuario: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    carnet_rostro: DataTypes.BOOLEAN,
    es_correo_institucional: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'supervisor',
    tableName: 'supervisor',
    timestamps: false
  });
  return supervisor;
};