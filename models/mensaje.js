'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mensaje extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mensaje.init({
    id_chat: DataTypes.INTEGER,
    emisor: DataTypes.STRING,
    texto: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'mensaje',
    tableName: 'mensaje',
    timestamps: false
  });
  return mensaje;
};