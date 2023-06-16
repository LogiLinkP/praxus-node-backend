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
      pregunta_practica.belongsTo(models.practica, {foreignKey: 'id_practica',as: 'practica'});
    }
    //sirve para hacer pregunta_practica.get.practica() y obtener la practica asociada
  }
  pregunta_practica.init({
    enunciado: DataTypes.STRING,
    tipo_pregunta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pregunta_practica',
    tableName: 'pregunta_practica'
  });
  return pregunta_practica;
};