'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carrera extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.config_practica, {
        foreignKey: 'id_carrera'
        });
      this.hasMany(models.respuesta_ramos, {
        foreignKey: 'id_carrera'
        });
      this.hasMany(models.encargado, {
        foreignKey: 'id_carrera'
        });
      this.hasMany(models.estudiante, {
        foreignKey: 'id_carrera'
        });
      this.hasMany(models.aptitud, {
        foreignKey: 'id_carrera'
      });
    }
  }
  carrera.init({
    nombre: DataTypes.STRING,
    ramos: DataTypes.STRING,
    correos_admitidos: DataTypes.STRING,
    estadistica_ramos: DataTypes.JSON,
    sueldo_promedio: DataTypes.INTEGER,
    sueldo_ramos: DataTypes.JSON,
    promedio_aptitudes: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'carrera',
    tableName: 'carrera',
    timestamps: false
  });
  return carrera;
};