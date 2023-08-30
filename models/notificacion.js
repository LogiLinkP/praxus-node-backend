'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notificacion.init({
    id_usuario: DataTypes.INTEGER,
    texto: DataTypes.STRING,
    fecha: DataTypes.DATE,
    visto: DataTypes.BOOLEAN,
    link: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'notificacion',
    tableName: 'notificacion',
    timestamps: false
  });
  return notificacion;
};