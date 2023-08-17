'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class encargado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
    }
  }
  encargado.init({
    id_usuario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'encargado',
    tableName: 'encargado',
    timestamps: false
  });
  return encargado;
};