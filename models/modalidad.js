'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class modalidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.practica, {
        foreignKey: 'id_modalidad'
      });

      this.belongsTo(models.config_practica, {
        foreignKey: 'id_config_practica'
      });
    }
  }
  modalidad.init({
    id_config_practica: DataTypes.INTEGER,
    tipo_modalidad: DataTypes.STRING,
    cantidad_tiempo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'modalidad',
    tableName: 'modalidad',
    timestamps: false
  });
  return modalidad;
};