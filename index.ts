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



//procesamiento periodico de datos

const { carrera, respuesta_ramos, empresa, practica, estudiante, config_practica, pregunta_encuesta_final, respuesta_encuesta_final, estadistica } = require('./models');
var cron = require('node-cron');

//listo
const actualizar_ramos = async () => {
  const carreras  = await carrera.findAll();
  for (let i=0; i<carreras.length; i++){
    let array_respuesta_ramos = await respuesta_ramos.findAll({
      where: {
        id_carrera: carreras[i].id
      }
    });
    
    let ramos_aux: string[] = [];
    let votacion_ramos: number[] = [];

    for (let k=0; k<array_respuesta_ramos.length; k++){
      let ramos_seleccionados = array_respuesta_ramos[k].respuesta.split(";;");

      for (let j=0; j<ramos_seleccionados.length; j++){
        if (ramos_aux.includes(ramos_seleccionados[j])){
          votacion_ramos[ramos_aux.indexOf(ramos_seleccionados[j])] += 1;
        }
        else{
          ramos_aux.push(ramos_seleccionados[j]);
          votacion_ramos.push(1);
        }
      }
    }

    let estadistica_ramos: any[][] = [[]];

    for (let k=0; k<votacion_ramos.length; k++){
      estadistica_ramos[0].push(ramos_aux[k],Math.floor(votacion_ramos[k]*100/array_respuesta_ramos.length));
    }

    let objecto_estadistica_ramos = {"array": estadistica_ramos};

    //console.log(carreras[i].nombre)
    //console.log(objecto_estadistica_ramos);

    const Carrera = await carrera.findOne({ where: { id: carreras[i].id } })
    Carrera.update({
      estadistica_ramos: objecto_estadistica_ramos
    })
  }
}

//listo
const actualizar_empresa = async () => {
  const  empresas  = await empresa.findAll();
  for (let i=0; i<empresas.length; i++){
    let array_practicas = await practica.findAll({
      where: {
        id_empresa: empresas[i].id
      }
    });

    let calificaciones_aux: number[] = [];
    let cantidad_destacados: number = 0.0;

    for (let k=0; k<array_practicas.length; k++){
      let estudiante_practica = await estudiante.findOne({
        where: {
          id: array_practicas[k].id_estudiante
        }
      });
      if (estudiante_practica.empresa_destacada == true){
        cantidad_destacados += 1;
      }
      if (!isNaN(array_practicas[k].calificacion_empresa)){
        calificaciones_aux.push(array_practicas[k].calificacion_empresa);
      }
    }
  
    //let promedio_calificaciones = 
    //calcula promedio de calificaciones
    let promedio_calificaciones = 0;
    for (let k=0; k<calificaciones_aux.length; k++){
      promedio_calificaciones += calificaciones_aux[k];
    }
    promedio_calificaciones = promedio_calificaciones/calificaciones_aux.length;

    if(calificaciones_aux.length == 0){
      promedio_calificaciones = 0;
    }

    let porcentaje_destacados = cantidad_destacados*100/array_practicas.length;

    if (array_practicas.length == 0){
      porcentaje_destacados = 0;
    }

    console.log(empresas[i].nombre_empresa) 
    console.log(promedio_calificaciones)
    console.log(porcentaje_destacados)

    const Empresa = await empresa.findOne({ where: { id: empresas[i].id } })
    
    Empresa.update({
      calificacion_promedio: promedio_calificaciones,
      practicantes_destacados: porcentaje_destacados
    })

  }
}

const actualizar_encuesta_practica = async () => {
  const  lista_config_practicas  = await config_practica.findAll();
  //console.log(lista_config_practicas);

  //recorriendo cada config practica
  for (let i=0; i<lista_config_practicas.length; i++){
    console.log(lista_config_practicas[i].nombre);
    let lista_preguntas_encuesta = await pregunta_encuesta_final.findAll({
      where: {
        id_config_practica: lista_config_practicas[i].id
      }
    });
    //console.log(lista_preguntas_encuesta);

    //let estadisticas_config_practica_aux = [];
    //borrando estadisticas actuales de cada config practica
    await estadistica.destroy({
      where: {
        id_config_practica: lista_config_practicas[i].id
      }
    });

    //recorriendo cada pregunta de la config practica
    for(let j=0; j<lista_preguntas_encuesta.length; j++){
      //console.log("pregunta");
      //console.log(lista_preguntas_encuesta[j].enunciado);

      let opciones_aux = lista_preguntas_encuesta[j].opciones.split(";;");
      let cantidad_opcion_marcada = new Array(opciones_aux.length).fill(0);

      //console.log("opciones");
      //console.log(opciones_aux);

      let lista_respuestas_encuesta = await respuesta_encuesta_final.findAll({
        where: {
          id_pregunta_encuesta_final: lista_preguntas_encuesta[j].id
        }
      });
      //console.log("respuestas")
      //console.log(lista_respuestas_encuesta);

      //recorriendo respuestas de la pregunta
      for (let k=0; k<lista_respuestas_encuesta.length; k++){
        let respuesta_aux = lista_respuestas_encuesta[k].respuesta.split(",");
        //console.log(respuesta_aux);
        //recorriendo opciones de la pregunta
        for (let l=0; l<respuesta_aux.length; l++){
          if(respuesta_aux[l] == 1){
            cantidad_opcion_marcada[l] += 1;
          }
        }
      }

      //console.log("cantidad opcion marcada");
      //console.log(cantidad_opcion_marcada);

      let estadistica_pregunta_aux = [];

      estadistica_pregunta_aux.push(lista_config_practicas[i].id,lista_preguntas_encuesta[j].enunciado);

      for (let k=0; k<cantidad_opcion_marcada.length; k++){
        estadistica_pregunta_aux.push(opciones_aux[k])
        if (!(cantidad_opcion_marcada[k]*100/lista_respuestas_encuesta.length)){
          estadistica_pregunta_aux.push(0);
        }
        else{
          estadistica_pregunta_aux.push(Math.floor(cantidad_opcion_marcada[k]*100/lista_respuestas_encuesta.length));
        }
      }

      //console.log("estadistica pregunta");
      //console.log(estadistica_pregunta_aux);

      //agregar a tabla estadistica con formato correspondiente

      estadistica.create({
        id_config_practica: estadistica_pregunta_aux[0],
        pregunta_respuestas: {"array":estadistica_pregunta_aux}
      })
    }
  }  
}

cron.schedule('59 23 * * 0', () => {
//cron.schedule('*/5 * * * *', () => {
  console.log('Actualizando estadisticas de ramos, empresas y encuesta practica');
  actualizar_ramos();
  actualizar_empresa();
  actualizar_encuesta_practica();
});