'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class publicaciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  publicaciones.init({
    id: DataTypes.INTEGER,
    id_encargado: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER,
    titulo: DataTypes.STRING,
    enunciado: DataTypes.STRING,
    fecha: DataTypes.DATE,
    isfijo: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'publicaciones',
    timestamps: false
  });
  return publicaciones;
};