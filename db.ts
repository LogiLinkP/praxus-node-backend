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
    },
    logging: false
});


module.exports = sequelize;