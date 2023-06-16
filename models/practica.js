'use strict';
const {
  Model
} = require('sequelize');
const pregunta_practica = require('./pregunta_practica');
module.exports = (sequelize, DataTypes) => {
  class practica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      practica.hasMany(models.pregunta_practica, {foreignKey: 'id_practica',as: 'pregunta_practica'});
      practica.hasMany(models.pregunta_supervisor, {foreignKey: 'id_practica',as: 'pregunta_supervisor'});
      practica.hasMany(models.informe, {foreignKey: 'id_practica',as: 'informe'});
      practica.hasMany(models.estudiante_cursa_practica, {foreignKey: 'id_practica',as: 'estudiante_cursa_practica'});
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