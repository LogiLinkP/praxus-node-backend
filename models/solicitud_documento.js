'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class solicitud_documento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  solicitud_documento.init({
    id_config_practica: DataTypes.INTEGER,
    tipo_archivo: DataTypes.STRING,
    nombre_solicitud: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'solicitud_documento',
    tableName: 'solicitud_documento'
  });
  return solicitud_documento;
};