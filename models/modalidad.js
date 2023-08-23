'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class modalidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  modalidad.init({
    id_config_practica: DataTypes.INTEGER,
    modalidad: DataTypes.STRING,
    cantidad_tiempo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'modalidad',
    tableName: 'modalidad',
    timestamps: false
  });
  return modalidad;
};