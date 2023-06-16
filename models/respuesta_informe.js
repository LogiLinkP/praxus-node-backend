'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class respuesta_informe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  respuesta_informe.init({
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'respuesta_informe',
    tableName: 'respuesta_informe'
  });
  return respuesta_informe;
};