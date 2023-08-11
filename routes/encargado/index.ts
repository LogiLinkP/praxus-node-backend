export { };

const { encargado } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerEncargado = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerEncargado.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await encargado.findOne({
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
routerEncargado.get('/todos', async (req: any, res: any) => {
  try {
    const data = await encargado.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerEncargado.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando encargado con id: ", req.query.id)
  encargado.destroy({
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
      console.log('Error al eliminar encargado', err);
    })
})
//[POST] Crear uno
routerEncargado.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_usuario} = req.body;
  console.log("Request de encargado");
  encargado.create({
    id_usuario: id_usuario
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("encargado creada");
  })
  .catch((err:any) => {
      console.log('Error al crear encargado',err);
  })
})


//[PUT]
routerEncargado.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Encargado = await encargado.findOne({ where: { id: req.body.id } })
  if (Encargado) {
    // actualizar practica
    Encargado.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar encargado', err);
      })
  } else {
    console.log("No existe encargado con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerEncargado;