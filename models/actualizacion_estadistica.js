'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class actualizacion_estadistica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  actualizacion_estadistica.init({
    dia_actualizacion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'actualizacion_estadistica',
    tableName: 'actualizacion_estadistica',
    timestamps: false
  });
  return actualizacion_estadistica;
};