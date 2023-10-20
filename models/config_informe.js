'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class config_informe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.informe, {
        foreignKey: 'id_config_informe'
      });
      this.hasMany(models.pregunta_informe, {
        foreignKey: 'id_config_informe'
      })
    }
  }
  config_informe.init({
    id_config_practica: DataTypes.INTEGER,
    tipo_informe: DataTypes.STRING,
    archivo_o_encuesta: DataTypes.STRING,
    tipo_archivo: DataTypes.STRING,
    plantilla: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'config_informe',
    tableName: 'config_informe',
    timestamps: false
  });
  return config_informe;
};