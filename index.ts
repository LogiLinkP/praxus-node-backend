import { setupIo } from "./middleware/socketMiddleware";
import { createServer } from "https";
import { readFileSync } from "fs";

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
let cors = require('cors')
const chalk = require('chalk');
const sequelize = require('./db');

const httpsServer = createServer({
  key: readFileSync("/etc/letsencrypt/live/logilink.hopto.org/privkey.pem"),
  cert: readFileSync("/etc/letsencrypt/live/logilink.hopto.org/cert.pem")
});


app.use(cors());

//USAR ROUTES
app.use("/", require("./routes"));

app.listen(PORT, function (err: any) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
  sequelize.sync({ force: false }).then(() => { // sync() se conecta con las tablas existentes, sino las crea
    console.log('Database connected...');
  }).catch((err: any) => {
    console.log('Error: ', err);
  })
});

//Socket.io
const options = {
  cors: {
    origin: 'http://localhost:4200',
  },
};

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

httpsServer.listen(5000, function () {
  console.log('\n')
  console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green('5000')}`)
})