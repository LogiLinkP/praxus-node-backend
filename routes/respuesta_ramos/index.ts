export { };

const { respuesta_ramos } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerRespuestaRamos = new Router(); // /respuesta_ramos

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerRespuestaRamos.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await respuesta_ramos.findOne({
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
routerRespuestaRamos.get('/todos', async (req: any, res: any) => {
  try {
    const data = await respuesta_ramos.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerRespuestaRamos.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando respuesta_ramos con id: ", req.query.id)
  respuesta_ramos.destroy({
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
      console.log('Error al eliminar respuesta_ramos', err);
    })
})
//[POST] Crear uno
routerRespuestaRamos.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_carrera,respuesta } = req.body;
  console.log("Request de respuesta_ramos");
  respuesta_ramos.create({
    id_carrera: id_carrera,
    respuesta: respuesta
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.send("respuesta_ramos creada");
    })
    .catch((err: any) => {
      console.log('Error al crear respuesta_ramos', err);
    })
})


//[PUT]
routerRespuestaRamos.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Encargado = await respuesta_ramos.findOne({ where: { id: req.body.id } })
  if (Encargado) {
    // actualizar practica
    Encargado.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar respuesta_ramos', err);
      })
  } else {
    console.log("No existe respuesta_ramos con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerRespuestaRamos;