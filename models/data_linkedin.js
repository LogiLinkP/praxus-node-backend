'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class data_linkedin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.estudiante, { foreignKey: 'id_estudiante' });
    }
  }
  data_linkedin.init({
    id_estudiante: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    titulo_profesional: DataTypes.STRING,
    ubicacion: DataTypes.JSON,
    experiencias: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'data_linkedin',
    tableName: 'data_linkedins',
    timestamps: false
  });
  return data_linkedin;
};