'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class plagio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.practica, {
        foreignKey: 'id_practica'
      });
      this.belongsTo(models.informe, {
        foreignKey: 'id_informe_origen'
      });
      this.belongsTo(models.pregunta_informe, {
        foreignKey: 'id_pregunta_informe_origen'
      });
      this.belongsTo(models.informe, {
        foreignKey: 'id_informe_plagio'
      });
      this.belongsTo(models.pregunta_informe, {
        foreignKey: 'id_pregunta_informe_plagio'
      });
    }
  }
  plagio.init({
    id_practica: DataTypes.INTEGER,
    id_informe_origen: DataTypes.INTEGER,
    id_pregunta_informe_origen: DataTypes.INTEGER,
    id_informe_plagio: DataTypes.INTEGER,
    id_pregunta_informe_plagio: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'plagio',
    tableName: 'plagio',
    timestamps: false
  });
  return plagio;
};