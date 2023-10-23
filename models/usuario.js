'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.token_usuarios, { foreignKey: 'id_usuario' });
      this.hasMany(models.actividad_usuarios, { foreignKey: 'id_usuario' });
      this.hasOne(models.estudiante, { foreignKey: 'id_usuario' });
      this.hasOne(models.encargado, { foreignKey: 'id_usuario' });
    }
  }
  usuario.init({
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    nombre: DataTypes.STRING,
    es_encargado: DataTypes.BOOLEAN,
    es_supervisor: DataTypes.BOOLEAN,
    es_estudiante: DataTypes.BOOLEAN,
    es_admin: DataTypes.BOOLEAN,
    config: DataTypes.JSON,
    activado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuario',
    timestamps: false
  });
  return usuario;
};