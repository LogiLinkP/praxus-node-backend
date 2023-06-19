'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      documento.belongsTo(models.estudiante_cursa_practica, {foreignKey: 'id_estudiante_cursa_practica',as: 'estudiante_cursa_practica'});
    }
  }
  documento.init({
    id_estudiante_cursa_practica: DataTypes.INTEGER,
    tipo: DataTypes.STRING,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'documento',
    tableName: 'documento'
  });
  return documento;
};