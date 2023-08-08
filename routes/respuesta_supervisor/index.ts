export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerRespuestaSupervisor = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerRespuestaSupervisor.get('', (req: any, res: any) => {
    console.log("Obteniendo respuesta_supervisor con id: ", req.query.id)
    sequelize.respuesta_supervisor.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener respuesta_supervisor', err);
    })
})

//[GET] mostrar todos
routerRespuestaSupervisor.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todas las respuesta_supervisor")
    sequelize.respuesta_supervisor.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar respuesta_supervisor', err);
      res.send('Error al mostrar respuesta_supervisor', err)
    })
})

//[DELETE] Eliminar
routerRespuestaSupervisor.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminar respuesta_supervisor con id: ", req.query.id)
  sequelize.respuesta_supervisor.destroy({
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
    console.log('Error al eliminar respuesta_supervisor', err);
  })
})

//[POST] Crear uno
routerRespuestaSupervisor.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_supervisor, id_practica, respuesta} = req.body;
  console.log("Request de creacion de respuesta_supervisor");
  sequelize.respuesta_supervisor.create({
    id_supervisor: id_supervisor,
    id_practica: id_practica,
    respuesta: respuesta
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("respuesta_supervisor creado");
  })
  .catch((err:any) => {
      console.log('Error al crear respuesta_supervisor',err);
  })
})


//[PUT]
routerRespuestaSupervisor.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const respuesta_supervisor = await sequelize.respuesta_supervisor.findOne({ where: { id: req.body.id } })
    if (respuesta_supervisor) {
      respuesta_supervisor.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actulizar respuesta_supervisor', err);
      })
    } else {
        console.log("No existe respuesta_supervisor con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerRespuestaSupervisor;