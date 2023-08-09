'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class respuesta_encuesta_final extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  respuesta_encuesta_final.init({
    id_pregunta_encuesta_final: DataTypes.INTEGER,
    respuesta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'respuesta_encuesta_final',
    tableName: 'respuesta_encuesta_final',
    timestamps: false
  });
  return respuesta_encuesta_final;
};