'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.solicitud_documento, {
        foreignKey: 'id_solicitud_documento'
      });
    }
  }
  documento.init({
    id_practica: DataTypes.INTEGER,
    id_solicitud_documento: DataTypes.INTEGER,
    key: DataTypes.STRING,
    fecha_subida: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'documento',
    tableName: 'documento',
    timestamps: false
  });
  return documento;
};