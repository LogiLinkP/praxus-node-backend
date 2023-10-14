'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class aptitud extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.carrera, {
        foreignKey: 'id_carrera'
      });
    }
  }
  aptitud.init({
    nombre: DataTypes.STRING,
    rango: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'aptitud',
    tableName: 'aptitud',
    timestamps: false
  });
  return aptitud;
};