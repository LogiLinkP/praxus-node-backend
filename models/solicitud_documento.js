'use strict';
const {
  Model, HasMany
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class solicitud_documento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo( models.config_practica, { foreignKey: 'id_config_practica' } );
      this.hasMany( models.documento, { foreignKey: 'id_solicitud_documento' } );
    }
  }
  solicitud_documento.init({
    id_config_practica: DataTypes.INTEGER,
    tipo_archivo: DataTypes.STRING,
    nombre_solicitud: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'solicitud_documento',
    tableName: 'solicitud_documento',
    timestamps: false
  });
  return solicitud_documento;
};