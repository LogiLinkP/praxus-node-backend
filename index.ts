require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const sequelize = require('./db');

//USAR ROUTES
app.use("/", require("./routes"));

app.listen(PORT, function (err:any) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
  sequelize.sync({force: false}).then(() => { // sync() se conecta con las tablas existentes, sino las crea
    console.log('Database connected...');
  }).catch((err:any) => {
    console.log('Error: ', err);
  })
});