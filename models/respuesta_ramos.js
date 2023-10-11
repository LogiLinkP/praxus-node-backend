'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class respuesta_ramos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.carrera, {
        foreignKey: 'id_carrera'
      });
    }
  }
  respuesta_ramos.init({
    id_carrera: DataTypes.INTEGER,
    respuesta: DataTypes.STRING,
    id_practica: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'respuesta_ramos',
    tableName: 'respuesta_ramos',
    timestamps: false
  });
  return respuesta_ramos;
};