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
      // this has many practica
      this.hasMany(models.practica, {
        foreignKey: 'id_config_practica'
      });

      this.hasMany(models.solicitud_documento, {
        foreignKey: 'id_config_practica'
      });

      this.hasMany(models.config_informe, {
        foreignKey: 'id_config_practica'
      });

      this.hasMany(models.pregunta_supervisor, {
        foreignKey: 'id_config_practica'
      });

      this.hasMany(models.modalidad, {
        foreignKey: 'id_config_practica'
      });
      this.belongsTo(models.carrera, {
        foreignKey: 'id_carrera'
      });
    }
  }
  config_practica.init({
    nombre: DataTypes.STRING,
    frecuencia_informes: DataTypes.STRING,
    informe_final: DataTypes.STRING,
    activada: DataTypes.BOOLEAN,
    id_carrera: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'config_practica',
    tableName: 'config_practica',
    timestamps: false
  });
  return config_practica;
};