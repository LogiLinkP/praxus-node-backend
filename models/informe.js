'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class informe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  informe.init({
    id_practica: DataTypes.INTEGER,
    id_config_informe: DataTypes.INTEGER,
    horas_trabajadas: DataTypes.INTEGER,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'informe',
    tableName: 'informe',
    timestamps: false
  });
  return informe;
};