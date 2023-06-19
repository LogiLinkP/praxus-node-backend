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
      usuario.hasOne(models.estudiante, {foreignKey: 'id_usuario', as: 'estudiante'});
      // usuario.hasMany(models.usuario, {foreignKey: 'id_usuario', as: 'usuario'});
      //usuario.hasOne(modeles.estudiante, {foreignKey: 'id_usuario', as: 'estudiante'});
    }
  }
  usuario.init({
    tipo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuario'
  });
  return usuario;
};