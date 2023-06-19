'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class config_practica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      config_practica.hasMany(models.pregunta_practica, {foreignKey: 'id_practica',as: 'pregunta_practica'});
      config_practica.hasMany(models.pregunta_supervisor, {foreignKey: 'id_practica',as: 'pregunta_supervisor'});
      config_practica.hasMany(models.config_informe, {foreignKey: 'id_config_practica',as: 'config_informe'});
      config_practica.hasMany(models.practica, {foreignKey: 'id_config_practica',as: 'practica'});
    }
  }
  config_practica.init({
    tipo: DataTypes.STRING,
    modalidad: DataTypes.STRING,
    nombre: DataTypes.STRING,
    num_informes: DataTypes.INTEGER,
    cantidad_horas: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'config_practica',
    tableName: 'config_practica'
  });
  return config_practica;
};