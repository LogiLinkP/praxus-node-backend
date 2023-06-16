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
    }
  }
  estudiante_cursa_practica.init({
    estado: DataTypes.STRING,
    nombre_supervisor: DataTypes.STRING,
    correo_supervisor: DataTypes.STRING,
    nombre_empresa: DataTypes.STRING,
    rut_empresa: DataTypes.STRING,
    fecha_incio: DataTypes.STRING,
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