'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class publicacion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    publicacion.init({
        id_encargado: DataTypes.INTEGER,
        id_carrera: DataTypes.INTEGER,
        titulo: DataTypes.STRING,
        enunciado: DataTypes.STRING,
        fecha: DataTypes.DATE,
        isfijo: DataTypes.BOOLEAN,
        fecha_programada: DataTypes.DATE,
        enviable: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'publicacion',
        tableName: 'publicacions',
        timestamps: false
    });
    return publicacion;
};