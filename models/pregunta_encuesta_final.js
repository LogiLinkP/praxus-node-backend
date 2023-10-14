'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pregunta_encuesta_final extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        pregunta_encuesta_final.belongsTo(models.config_practica, {
          foreignKey: 'id_config_practica',
          as: 'config_practica'
        });
    }
  }
  pregunta_encuesta_final.init({
    id_config_practica: DataTypes.INTEGER,
    enunciado: DataTypes.STRING,
    tipo_respuesta: DataTypes.STRING,
    opciones: DataTypes.STRING,
    fija: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'pregunta_encuesta_final',
    tableName: 'pregunta_encuesta_final',
    timestamps: false
  });
  return pregunta_encuesta_final;
};