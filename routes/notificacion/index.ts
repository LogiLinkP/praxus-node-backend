import { sendMail } from "../../utils/email";
import { Server } from 'socket.io';
import { getIo } from '../../middleware/socketMiddleware';

export { };

const { notificacion } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerNotificacion = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();



//[GET] MODIFICAR mostrar todos por id_usuario
routerNotificacion.get('/todos', jsonParser, async (req: any, res: any) => {
  const { id_usuario, config } = req.query;

  try {
    const data = await notificacion.findAll({
      where: {
        id_usuario: id_usuario,
        visto: false,
        //config: config,     
      }
    });
    /*
    if(req.query.config == "Correos y Notificaciones" || req.query.config == "Sólo Notificaciones"){
      res.status(200).json(data);
    }
    */
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});


//[DELETE] Eliminar todos por id_usuario
routerNotificacion.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando notificacion con id_usuario: ", req.query.id)
  notificacion.destroy({
    where: {
      id_usuario: req.query.id_usuario
    }
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err: any) => {
      res.send(500)
      console.log('Error al eliminar notificacion', err);
    })
})



//[POST] 
routerNotificacion.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_usuario, fecha, mensaje, correo, estado, enlace } = req.body;
  notificacion.create({
    id_usuario: id_usuario,
    texto: mensaje,
    fecha: fecha,
    link: enlace,
  })
    .then((resultados: any) => {
      console.log(resultados);
      /*
      if(estado == "Notificaciones y Correo" || estado == "Sólo Correo"){
        let mensaje_correo: string = notificacion.texto + "Visite Praxus para revisar."
        sendMail(correo,"Notificación Praxus", mensaje_correo, "Notificación Praxus");
      }
      if(estado == "Notificaciones y Correo" || estado == "Sólo Notificaciones"){
        const io: Server = getIo();
        let roomName = "notificaciones"+id_usuario;
        let mensaje_noti = mensaje;
        
        io.to(roomName).emit('notificacion', { fecha: fecha, message: mensaje_noti });
        console.log("EMITIENDO EVENTO EN SALA", roomName);

        res.send("notificacion creada");
      }
      */
      if(estado == "Notificaciones y Correo" || estado == "Sólo Correo"){
        let mensaje_correo: string = mensaje + ". Visite Praxus para revisar.";
        sendMail(correo, "Notificación de Praxus", mensaje_correo, "Notificación de Praxus");
      }
      else if(estado == "Notificaciones y Correo" || estado == "Sólo Notificaciones"){
        const io: Server = getIo();
        let roomName = "notificaciones" + id_usuario;
        let mensaje_noti = mensaje;

        io.to(roomName).emit('notificacion', { fecha: fecha, message: mensaje_noti, link: enlace });
        console.log("EMITIENDO EVENTO EN SALA", roomName);

        res.send("notificacion creada");
      }
    })
    .catch((err: any) => {
      console.log('Error al crear notificacion', err);
    })
})


//[PUT]
routerNotificacion.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Notificacion = await notificacion.findOne({ where: { id: req.body.id } })
  if (Notificacion) {
    // actualizar practica
    Notificacion.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar notificacion', err);
      })
  } else {
    console.log("No existe notificacion con id: ", req.query.id)
    res.sendStatus(404)
  }
})


routerNotificacion.put('/visto', jsonParser, async (req: any, res: any) => {
  // get all notificaciones with findall
  const Notificaciones = await notificacion.update({ visto: true }, {
    where: {
      id_usuario: req.body.id_usuario,
      visto: false,
    }
  }).then((resultados: any) => {
    console.log(resultados);
    res.sendStatus(200);
  }
  ).catch((err: any) => {
    res.send(500)
    console.log('Error al actualizar notificacion', err);
  })
})

routerNotificacion.get('/todas_hasta_vistas', jsonParser, async (req: any, res: any) => {
  let id = req.query.id_usuario;
  try {
    const data = await notificacion.findAll({
      where: {
        id_usuario: id,
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});





module.exports = routerNotificacion;