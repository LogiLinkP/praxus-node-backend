'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class practica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  practica.init({
    tipo_practica: DataTypes.STRING,
    modalidad: DataTypes.STRING,
    nombre: DataTypes.STRING,
    num_informes: DataTypes.INTEGER,
    horas: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'practica',
    tableName: 'practica'
  });
  return practica;
};