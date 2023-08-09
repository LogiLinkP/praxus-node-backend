'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class estudiante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  estudiante.init({
    id_usuario: DataTypes.INTEGER,
    nombre_id_org: DataTypes.STRING,
    id_org: DataTypes.STRING,
    rut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'estudiante',
    tableName: 'estudiante',
    timestamps: false
  });
  return estudiante;
};