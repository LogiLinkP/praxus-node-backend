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
      this.hasMany(models.practica, {
        foreignKey: 'id'
      });

      this.belongsTo(models.usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario' // This alias can be used when querying
      });
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