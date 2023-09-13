const fs = require('fs');
require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/../cert/ca-certificates.crt', "utf8")
      }
    }
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/../cert/ca-certificates.crt', "utf8")
      }
    }
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/../cert/ca-certificates.crt', "utf8")
      }
    }
  }
}