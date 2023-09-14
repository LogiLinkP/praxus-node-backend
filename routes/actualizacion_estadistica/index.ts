export { };

const { actualizacion_estadistica } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerActualizacionEstadistica = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerActualizacionEstadistica.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await actualizacion_estadistica.findOne({
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
routerActualizacionEstadistica.get('/todos', async (req: any, res: any) => {
  try {
    const data = await actualizacion_estadistica.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//Eliminat todas las actualizacion_estadisticas
routerActualizacionEstadistica.delete('/eliminar_todos', (req: any, res: any) => {
  console.log("Eliminando todas las actualizacion_estadisticas")
  actualizacion_estadistica.destroy({
    where: {},
    truncate: true
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.status(200).json(resultados);
    })
    .catch((err: any) => {
      res.status(500).json(err)
      console.log('Error al eliminar todas las actualizacion_estadisticas', err);
    })
})

//[DELETE] Eliminar
routerActualizacionEstadistica.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando actualizacion_estadistica con id: ", req.query.id)
 actualizacion_estadistica.destroy({
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
      console.log('Error al eliminar actualizacion_estadistica', err);
    })
})

//[POST] Crear uno
routerActualizacionEstadistica.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_config_practica,pregunta_respuestas} = req.body;
  console.log("Request de actualizacion_estadistica");
 actualizacion_estadistica.create({
    id_config_practica: id_config_practica,
    pregunta_respuestas: pregunta_respuestas
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.status(200).json({ message: "actualizacion_estadistica creada", id: resultados.id });
  })
  .catch((err:any) => {
      res.status(500).json({ message: "Error al crear actualizacion_estadistica", error: err});
  })
})


//[PUT]
routerActualizacionEstadistica.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Chat = await actualizacion_estadistica.findOne({ where: { id: req.body.id } })
  if (Chat) {
    // actualizar practica
    Chat.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar actualizacion_estadistica', err);
      })
  } else {
    console.log("No existe actualizacion_estadistica con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerActualizacionEstadistica;