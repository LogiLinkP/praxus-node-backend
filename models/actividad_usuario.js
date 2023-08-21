'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class actividad_usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.usuario, { foreignKey: 'id_usuario' });
    }
  }
  actividad_usuario.init({
    id_usuario: DataTypes.INTEGER,
    accion: DataTypes.STRING,
    fecha: DataTypes.DATE,
    useragent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'actividad_usuario',
    tableName: 'actividad_usuario',
    timestamps: false
  });
  return actividad_usuario;
};