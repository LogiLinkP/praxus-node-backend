import { createServer } from "https";
import { readFileSync } from "fs";
import { setupIo } from "./middleware/socketMiddleware";
const express = require('express');
const chalk = require('chalk');
const sequelize = require('./db');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors());
app.use("/", require("./routes"));

//Socket.io
const options = {
  cors: {
    origin: process.env.URL_FRONTEND,
  },
};

const PORT = process.env.PORT || 3000;
const PORT_SOCKET = +(process.env.PORT_SOCKET || 5000);

if (!process.env.MODO || (process.env.MODO && process.env.MODO === 'DESARROLLO')) {
  console.log("Modo DESARROLLO")

  app.listen(PORT, function (err: any) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
    // sequelize.sync({ force: false }).then(() => { // sync() se conecta con las tablas existentes, sino las crea
    //   console.log('Database connected...');
    // }).catch((err: any) => {
    //   console.log('Error: ', err);
    // })
  });

  const server = require('http').Server(app);
  const io = setupIo(server, options);

  io.on('connection', function (socket: any) {

    const handshake = socket.id;

    let { nameRoom } = socket.handshake.query;
    console.log(`${chalk.green(`Nuevo dispositivo: ${handshake}`)} conectado a la sala ${nameRoom}`);
    socket.join(nameRoom)

    socket.on('evento', (res: any) => {
      // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje 
      console.log("Evento recibido", res, nameRoom)
      socket.to(nameRoom).emit('evento', res);
    })

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  server.listen(PORT_SOCKET, function () {
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green(`${PORT_SOCKET}`)}`)
  })
} else {

  const privateKey = readFileSync("./cert/privkey1.pem", 'utf8');
  const certificate = readFileSync("./cert/cert1.pem", 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = createServer(credentials);
  const httpsServer_main = createServer(credentials, app);
  //USAR ROUTES


  httpsServer_main.listen(PORT, function () {
    console.log("Server listening on PORT", PORT);
    // sequelize.sync({ force: false }).then(() => { // sync() se conecta con las tablas existentes, sino las crea
    //   console.log('Database connected...');
    // }).catch((err: any) => {
    //   console.log('Error: ', err);
    // })
  });

  // const server = require('http').Server(app);
  const io = setupIo(httpsServer, options);

  io.on('connection', function (socket: any) {

    const handshake = socket.id;

    let { nameRoom } = socket.handshake.query;
    console.log(`${chalk.green(`Nuevo dispositivo: ${handshake}`)} conectado a la sala ${nameRoom}`);
    socket.join(nameRoom)

    socket.on('evento', (res: any) => {
      // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje 
      console.log("Evento recibido", res, nameRoom)
      socket.to(nameRoom).emit('evento', res);
    })

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  httpsServer.listen(PORT_SOCKET, function () {
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green(`${PORT_SOCKET}`)}`)
  })
}