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

      this.belongsTo(models.estudiante, {
        foreignKey: 'id_estudiante'
      });
      // this belongs to supervisor, config_practica, empresa
      this.belongsTo(models.supervisor, {
        foreignKey: 'id_supervisor'
      });
      this.belongsTo(models.modalidad, {
        foreignKey: 'id_modalidad'
      });
      this.belongsTo(models.config_practica, {
        foreignKey: 'id_config_practica'
      });
      this.belongsTo(models.empresa, {
        foreignKey: 'id_empresa'
      });
      this.belongsTo(models.encargado, {
        foreignKey: 'id_encargado'
      });

      // this has many respuesta_supervisor, documento, documento_extra, informe
      this.hasMany(models.respuesta_supervisor, {
        foreignKey: 'id_practica'
      });
      this.hasMany(models.documento, {
        foreignKey: 'id_practica'
      });
      this.hasMany(models.documento_extra, {
        foreignKey: 'id_practica'
      });
      this.hasMany(models.informe, {
        foreignKey: 'id_practica'
      });
      this.hasMany(models.informe, {
        foreignKey: 'id_practica'
      });
      this.hasMany(models.respuesta_supervisor, {
        foreignKey: 'id_practica'
      });
    }
  }
  practica.init({
    id_estudiante: DataTypes.INTEGER,
    id_config_practica: DataTypes.INTEGER,
    id_supervisor: DataTypes.INTEGER,
    id_empresa: DataTypes.INTEGER,
    id_encargado: DataTypes.INTEGER,
    id_modalidad: DataTypes.INTEGER,
    estado: DataTypes.STRING,
    fecha_inicio: DataTypes.DATE,
    fecha_termino: DataTypes.DATE,
    nota_eval: DataTypes.FLOAT,
    consistencia_informe: DataTypes.FLOAT,
    consistencia_nota: DataTypes.FLOAT,
    resumen: DataTypes.JSON,
    indice_repeticion: DataTypes.FLOAT,
    key_repeticiones: DataTypes.JSON,
    key_fragmentos: DataTypes.JSON,
    interpretacion_informe: DataTypes.STRING,
    interpretacion_nota: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'practica',
    tableName: 'practica',
    timestamps: false
  });
  return practica;
};