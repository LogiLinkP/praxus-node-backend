export { };

const { chat } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerChat = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerChat.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await chat.findOne({
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

//[GET] para obtener uno con BODY id_estudiante y id_encargado

routerChat.get('/get', async (req: any, res: any) => {
  try {
    console.log("datos de request:", req.query.id_estudiante, req.query.id_encargado);
    if ((req.query.id_estudiante==null) || (req.query.id_encargado==null)) {
      res.status(406).json({ message: "Se requiere ingresar id de estudiante y de encargado" });    
      return;
    }
    const data = await chat.findOne({
      where: {
        id_estudiante: req.query.id_estudiante,
        id_encargado: req.query.id_encargado
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] mostrar todos
routerChat.get('/todos', async (req: any, res: any) => {
  try {
    const data = await chat.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerChat.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando chat con id: ", req.query.id)
 chat.destroy({
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
      console.log('Error al eliminar chat', err);
    })
})

//[POST] Crear uno
routerChat.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_estudiante,id_encargado} = req.body;
  console.log("Request de chat");
 chat.create({
    id_estudiante: id_estudiante,
    id_encargado: id_encargado
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send( "chat creado");
  })
  .catch((err:any) => {
      console.log('Error al crear chat',err);
  })
})


//[PUT]
routerChat.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Chat = await chat.findOne({ where: { id: req.body.id } })
  if (Chat) {
    // actualizar practica
    Chat.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar chat', err);
      })
  } else {
    console.log("No existe chat con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerChat;