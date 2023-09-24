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
        foreignKey: 'id_estudiante'
      });
      this.belongsTo(models.usuario, {
        foreignKey: 'id_usuario'
      });
      this.belongsTo(models.carrera, {
        foreignKey: 'id_carrera'
      });
      this.hasMany(models.data_linkedin, {
        foreignKey: 'id_estudiante'
      });
    }
  }
  estudiante.init({
    id_usuario: DataTypes.INTEGER,
    nombre_id_org: DataTypes.STRING,
    id_org: DataTypes.STRING,
    rut: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER,
    perfil_linkedin: DataTypes.STRING,
    empresa_destacada: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'estudiante',
    tableName: 'estudiante',
    timestamps: false
  });
  return estudiante;
};