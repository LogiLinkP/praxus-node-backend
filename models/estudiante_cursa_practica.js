'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class estudiante_cursa_practica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      estudiante_cursa_practica.hasMany(models.respuesta_informe, {foreignKey: 'id_estudiante_cursa_practica',as: 'respuestas_informe'});
      estudiante_cursa_practica.belongsTo(models.practica, {foreignKey: 'id_practica',as: 'practica'});
      estudiante_cursa_practica.belongsTo(models.estudiante, {foreignKey: 'id_estudiante',as: 'estudiante'});
      estudiante_cursa_practica.hasMany(models.documento, {foreignKey: 'id_estudiante_cursa_practica',as: 'documentos'});
    }
  }
  estudiante_cursa_practica.init({
    id_estudiante: DataTypes.INTEGER,
    id_practica: DataTypes.INTEGER,
    estado: DataTypes.STRING,
    nombre_supervisor: DataTypes.STRING,
    correo_supervisor: DataTypes.STRING,
    nombre_empresa: DataTypes.STRING,
    rut_empresa: DataTypes.STRING,
    fecha_inicio: DataTypes.STRING,
    fecha_termino: DataTypes.STRING,
    nota_evaluacion: DataTypes.INTEGER,
    consistencia_informe: DataTypes.INTEGER,
    consistencia_nota: DataTypes.INTEGER,
    key_informe_supervisor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'estudiante_cursa_practica',
    tableName: 'estudiante_cursa_practica'
  });
  return estudiante_cursa_practica;
};