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
      config_informe.belongsTo(models.config_practica, { foreignKey: 'id_config_practica', as: 'config_practica' });
      // config_informe.hasMany(models.respuesta_informe, {foreignKey: 'id_informe',as: 'informe'});
    }
  }
  config_informe.init({
    id_config_practica: DataTypes.INTEGER,
    tipo: DataTypes.STRING,
    hora: DataTypes.BOOLEAN,
    fecha: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'config_informe',
    tableName: 'config_informe'
  });
  return config_informe;
};