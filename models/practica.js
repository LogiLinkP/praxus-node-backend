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
    }
  }
  practica.init({
    id_estudiante: DataTypes.INTEGER,
    id_config_practica: DataTypes.INTEGER,
    id_supervisor: DataTypes.INTEGER,
    id_empresa: DataTypes.INTEGER,
    estado: DataTypes.STRING,
    fecha_inicio: DataTypes.DATE,
    fecha_termino: DataTypes.DATE,
    nota_eval: DataTypes.FLOAT,
    consistencia_informe: DataTypes.FLOAT,
    consistencia_nota: DataTypes.FLOAT,
    resumen: DataTypes.STRING,
    indice_repeticion: DataTypes.FLOAT,
    key_repeticiones: DataTypes.STRING,
    key_fragmentos: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'practica',
    tableName: 'practica',
    timestamps: false
  });
  return practica;
};