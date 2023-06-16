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
      estudiante.hasMany(models.estudiante_cursa_practica, {foreignKey: 'id_estudiante',as: 'estudiante_cursa_practica'});
      estudiante.belongsTo(models.usuario, {foreignKey: 'id_usuario', as: 'usuario'});
      // define association here
      //estudiante.belongsTo(models.usuario, {foreignKey: 'id_usuario', as: 'id_usuario'});

    }
  }
  estudiante.init({
    id_usuario: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    rol: DataTypes.STRING,
    rut: DataTypes.STRING,
    correo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'estudiante',
    tableName: 'estudiante'
  });
  return estudiante;
};