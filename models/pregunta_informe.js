'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pregunta_informe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pregunta_informe.init({
    id_config_informe: DataTypes.INTEGER,
    enunciado: DataTypes.STRING,
    tipo_respuesta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pregunta_informe',
    tableName: 'pregunta_informe'
  });
  return pregunta_informe;
};