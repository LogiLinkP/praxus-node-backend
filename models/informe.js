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
      informe.belongsTo(models.practica, {foreignKey: 'id_practica',as: 'practica'});
      informe.hasMany(models.respuesta_informe, {foreignKey: 'id_informe',as: 'respuesta_informe'});
    }
  }
  informe.init({
    id_practica: DataTypes.INTEGER,
    tipo_informe: DataTypes.STRING,
    hora: DataTypes.BOOLEAN,
    fecha: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'informe',
    tableName: 'informe'
  });
  return informe;
};