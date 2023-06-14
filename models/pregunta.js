'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pregunta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pregunta.init({
    enunciado: DataTypes.STRING,
    tipo_respuesta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pregunta',
    tableName: 'pregunta'
  });
  return pregunta;
};