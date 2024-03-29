'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.mensaje, {
        foreignKey: 'id_chat'
      });
    }
  }
  chat.init({
    id_encargado: DataTypes.INTEGER,
    id_estudiante: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chat',
    tableName: 'chat',
    timestamps: false
  });
  return chat;
};