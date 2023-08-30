'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pregunta_informe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.config_informe, {
        foreignKey: 'id_config_informe'
      })
    }
  }
  pregunta_informe.init({
    id_config_informe: DataTypes.INTEGER,
    enunciado: DataTypes.STRING,
    tipo_respuesta: DataTypes.STRING,
    opciones: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pregunta_informe',
    tableName: 'pregunta_informe',
    timestamps: false
  });
  return pregunta_informe;
};