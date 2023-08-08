'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documento_extra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  documento_extra.init({
    id_practica: DataTypes.INTEGER,
    nombre_solicitud: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    tipo_archivo: DataTypes.STRING,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'documento_extra',
    tableName: 'documento_extra'
  });
  return documento_extra;
};