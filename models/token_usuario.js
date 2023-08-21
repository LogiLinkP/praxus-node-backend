'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class token_usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.belongsTo(models.usuario, { foreignKey: 'id_usuario' });
    }
  }
  token_usuario.init({
    id_usuario: DataTypes.INTEGER,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'token_usuario',
    tableName: 'token_usuarios',
    timestamps: false
  });
  return token_usuario;
};