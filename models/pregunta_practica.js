'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pregunta_practica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pregunta_practica.belongsTo(models.config_practica, {foreignKey: 'id_config_practica',as: 'config_practica'});
    }
    //sirve para hacer pregunta_practica.get.practica() y obtener la practica asociada
  }
  pregunta_practica.init({
    id_config_practica: DataTypes.INTEGER,
    enunciado: DataTypes.STRING,
    tipo_pregunta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pregunta_practica',
    tableName: 'pregunta_practica'
  });
  return pregunta_practica;
};