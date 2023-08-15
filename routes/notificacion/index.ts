export { };

const { notificacion } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerNotificacion = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();



//[GET] MODIFICAR mostrar todos por id_usuario
routerNotificacion.get('/todos', async (req: any, res: any) => {
  try {
    const data = await notificacion.findAll({
      where: {
        id_usuario: req.query.id_usuario
      }
    });
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
  const {id_usuario, mensaje} = req.body;
  console.log("Request de notificacion");
  notificacion.create({
    id_usuario: id_usuario,
    texto: mensaje.texto,
    fecha: mensaje.fecha
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("notificacion creada");
  })
  .catch((err:any) => {
      console.log('Error al crear notificacion',err);
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

module.exports = routerNotificacion;