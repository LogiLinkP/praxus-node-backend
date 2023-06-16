'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pregunta_supervisor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pregunta_supervisor.init({
    enunciado: DataTypes.STRING,
    tipo_pregunta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pregunta_supervisor',
    tableName: 'pregunta_supervisor'
  });
  return pregunta_supervisor;
};