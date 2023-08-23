import { sendMail } from "../../utils/email";

export { };

const { mensaje,chat } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerMensaje = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerMensaje.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await mensaje.findOne({
      where: {
        id: req.query.id
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] mostrar todos
routerMensaje.get('/todos', async (req: any, res: any) => {
  try {
    const data = await mensaje.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerMensaje.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando mensaje con id: ", req.query.id)
 mensaje.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err: any) => {
      res.send(500)
      console.log('Error al eliminar mensaje', err);
    })
})


//[POST] Crear uno usando el id de estudiante y encargado (que se usan para buscar el chat)
routerMensaje.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_estudiante,id_encargado} = req.body;
  const msj = req.body.mensaje;
  const {emisor,texto,fecha} = msj;
  console.log("Datos obtenidos para crear mensaje: ", id_estudiante,id_encargado,emisor,texto,fecha);
  chat.findOne({ //Buscar chat con id_estudiante e id_encargado
    where: {
      id_estudiante: id_estudiante,
      id_encargado: id_encargado
    }
  })
  .then((resultados:any) => {
    if(resultados){
      mensaje.create({
          id_chat: resultados.id,
          emisor: emisor,
          texto: texto,
          fecha: fecha
        })
        .then((resultados:any) => {
          sendMail(, "Notificación", "Ha recibido un mensaje en uno de sus chat. Debería revisar Praxus.com para contestar", "Notificación");
          res.send( "mensaje creado");
        })
        .catch((err:any) => {
          console.log('Error al crear mensaje',err);
          res.send("Error al crear mensaje")
        })
    }else{
      res.send("No existe chat con esos id")
    }   
  })
  .catch((err:any) => {
      console.log('Error al obtener chat entre estudiante y encargado',err);
      res.send("Error al obtener chat entre estudiante y encargado")
  })
})


//[PUT]
routerMensaje.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Mensaje = await mensaje.findOne({ where: { id: req.body.id } })
  if (Mensaje) {
    // actualizar practica
    Mensaje.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar mensaje', err);
      })
  } else {
    console.log("No existe mensaje con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerMensaje;