'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class encargado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.usuario, {
        foreignKey: 'id_usuario'
      });

      this.hasMany(models.practica, {
        foreignKey: 'id_encargado'
      });
    }
  }
  encargado.init({
    id_usuario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'encargado',
    tableName: 'encargado',
    timestamps: false
  });
  return encargado;
};