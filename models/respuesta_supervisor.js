'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class respuesta_supervisor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.pregunta_supervisor, {
        foreignKey: 'id_pregunta_supervisor'
      });
      this.belongsTo(models.supervisor, {
        foreignKey: 'id_supervisor'
      });
    }
  }
  respuesta_supervisor.init({
    id_pregunta_supervisor: DataTypes.INTEGER,
    id_supervisor: DataTypes.INTEGER,
    id_practica: DataTypes.INTEGER,
    respuesta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'respuesta_supervisor',
    tableName: 'respuesta_supervisor',
    timestamps: false
  });
  return respuesta_supervisor;
};