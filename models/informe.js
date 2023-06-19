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
      informe.belongsTo(models.config_informe, {foreignKey: 'id_config_informe',as: 'config_informe'});
      informe.belongsTo(models.practica, {foreignKey: 'id_practica',as: 'practica'});
    }
  }
  informe.init({
    id_config_informe: DataTypes.INTEGER,
    id_practica: DataTypes.INTEGER,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'informe',
    tableName: 'informe'
  });
  return informe;
};