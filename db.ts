import { DataTypes } from "sequelize";

export { };

const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        }
    },
    define: {
        timestamps: false,
        frezeeTableName: true
    }
});

//asociar modelos con db
sequelize.estudiante = require('../models/estudiante')(sequelize, DataTypes);
sequelize.estudiante_cursa_practica = require('../models/estudiante_cursa_practica')(sequelize, DataTypes);
sequelize.informe = require('../models/informe')(sequelize, DataTypes);
sequelize.practica = require('../models/practica')(sequelize, DataTypes);
sequelize.respuesta_informe = require('../models/respuesta_informe')(sequelize, DataTypes);
sequelize.usuario = require('../models/usuario')(sequelize, DataTypes);
sequelize.pregunta_supervisor = require('../models/pregunta_supervisor')(sequelize, DataTypes);
sequelize.pregunta_practica = require('../models/pregunta_practica')(sequelize, DataTypes);
sequelize.documento = require('../models/documento')(sequelize, DataTypes);

module.exports = sequelize;