'use strict';
const {
  Model
} = require('sequelize');
const practica = require('./practica');
module.exports = (sequelize, DataTypes) => {
  class encargado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.usuario, {
        foreignKey: 'id_usuario'
      });

      this.belongsTo(models.carrera, {
        foreignKey: 'id_carrera'
      });

      this.hasMany(models.practica, {
        foreignKey: 'id_encargado'
      });

    }
  }
  encargado.init({
    id_usuario: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER,
    practica_pendiente: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'encargado',
    tableName: 'encargado',
    timestamps: false
  });
  return encargado;
};