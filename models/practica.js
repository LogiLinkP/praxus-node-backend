'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class practica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      practica.hasMany(models.informe, {foreignKey: 'id_practica',as: 'informe'});
      practica.belongsTo(models.config_practica, {foreignKey: 'id_config_practica', as: 'config_practica'});
      practica.belongsTo(models.estudiante, {foreignKey: 'id_estudiante',as: 'estudiante'});
      practica.hasMany(models.documento, {foreignKey: 'id_practica',as: 'documentos'});
    }
  }
  practica.init({
    id_estudiante: DataTypes.INTEGER,
    id_config_practica: DataTypes.INTEGER,
    estado: DataTypes.STRING,
    nombre_supervisor: DataTypes.STRING,
    correo_supervisor: DataTypes.STRING,
    nombre_empresa: DataTypes.STRING,
    rut_empresa: DataTypes.STRING,
    fecha_inicio: DataTypes.STRING,
    fecha_termino: DataTypes.STRING,
    nota_evaluacion: DataTypes.INTEGER,
    consistencia_informe: DataTypes.FLOAT,
    consistencia_nota: DataTypes.FLOAT,
    key_informe_supervisor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'practica',
    tableName: 'practica'
  });
  return practica;
};