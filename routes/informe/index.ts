export { };
import { Server } from 'socket.io';
import { getIo } from '../../middleware/socketMiddleware';

const { informe } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerInforme = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerInforme.get('', (req: any, res: any) => {
    console.log("Obteniendo informe con id: ", req.query.id)
    informe.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener informe', err);
    })
})

//[GET] mostrar todos
routerInforme.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los informe")
    informe.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar informe', err);
      res.send('Error al mostrar informe', err)
    })
})

//[DELETE] Eliminar
routerInforme.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando informe con id: ", req.query.id)
  informe.destroy({
    where: {
      id: req.query.id
    }
  })
  .then((resultados:any) => {
    console.log(resultados);
    res.sendStatus(200);
  })
  .catch((err:any) => {
    res.send(500)
    console.log('Error al eliminar de informe', err);
  })
})

//[POST] Crear uno
routerInforme.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_practica, id_config_informe, horas_trabajadas, key} = req.body;
  console.log("Request de creacion de informe");
  informe.create({
    id_practica: id_practica,
    id_config_informe: id_config_informe,
    horas_trabajadas: horas_trabajadas,
    fecha: Date.now(),
    key: key
  })
  .then((resultados:any) => {

    const io: Server = getIo();
    // send an event through socket.io
    let roomName = "notificaciones"+id_estudiante;
    let mensaje = "El alumno X ha mandado un informe de su práctica"
    io.to(roomName).emit('evento', { message: mensaje });
    console.log("EMITIENDO EVENTO EN SALA", roomName);
    console.log(resultados);
    res.send("informe creado");
  })
  .catch((err:any) => {
      res.sendStatus(500)
      console.log('Error al crear informe',err);
  })
})


//[PUT]
routerInforme.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const Informe = await informe.findOne({ where: { id: req.body.id } })
    if (Informe){
      Informe.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de informe', err);
      })
    } else {
        console.log("No existe informe con id: ", req.query.id)
        res.sendStatus(404)
    }
})

//[GET] mostrar todos los informes asociados a un id_practica
routerInforme.get('/todos_practica', (req:any, res:any) => {
  console.log("Obteniendo todos los informes")
  informe.findAll({
      where: {
        id_practica: req.query.id_practica
      }
    }
  ).then((resultados:any) => {
    res.send(resultados)
  })
  .catch((err:any) => {
    console.log('Error al mostrar informe', err);
    res.send('Error al mostrar informe', err)
  })
})


module.exports = routerInforme;