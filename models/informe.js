'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class informe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.plagio, {
        foreignKey: 'id_informe_origen',
        as: "informe_origen"
      });
      this.hasOne(models.plagio, {
        foreignKey: 'id_informe_plagio',
        as: "informe_plagio"
      });

      this.belongsTo(models.config_informe, {
        foreignKey: 'id_config_informe'
      });
      this.belongsTo(models.practica, {
        foreignKey: 'id_practica'
      });
    }
  }
  informe.init({
    id_practica: DataTypes.INTEGER,
    id_config_informe: DataTypes.INTEGER,
    horas_trabajadas: DataTypes.INTEGER,
    key: DataTypes.JSON,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'informe',
    tableName: 'informe',
    timestamps: false
  });
  return informe;
};