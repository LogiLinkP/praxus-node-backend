export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerRespuestaPreguntaFinal = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un respuesta_encuesta_final con su ID
routerRespuestaPreguntaFinal.get('', (req: any, res: any) => {
    console.log("Obteniendo respuesta_encuesta_final de id: ", req.query.id)
    sequelize.respuesta_encuesta_final.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener respuesta_encuesta_final', err);
        })
})

//[GET] mostrar todos los respuesta_encuesta_finals
routerRespuestaPreguntaFinal.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los respuesta_encuesta_finals")
    sequelize.respuesta_encuesta_final.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar respuesta_encuesta_final', err);
      res.send('Error al mostrar respuesta_encuesta_final', err)
    })
})

//[DELETE] Eliminar respuesta_encuesta_final con su ID
routerRespuestaPreguntaFinal.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando respuesta_encuesta_final con id: ", req.query.id)
    sequelize.respuesta_encuesta_final.destroy({
        where: {
          id: req.query.id
        }
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
    })
    .catch((err:any) => {
        res.send(500);
        console.log('Error al eliminar respuesta_encuesta_final', err);
    })
})

//[POST] Crear un respuesta_encuesta_final con los datos recibidos
routerRespuestaPreguntaFinal.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_pregunta_encuesta_final, respuesta} = req.body;
  console.log("Request de creacion de respuesta_encuesta_final recibida");
  sequelize.respuesta_encuesta_final.create({
      id_pregunta_encuesta_final: id_pregunta_encuesta_final,
      respuesta: respuesta
  })
  .then((resultados:any) => {
      res.send("respuesta_encuesta_final creado");
  })
  .catch((err:any) => {
      console.log('Error al crear respuesta_encuesta_final',err);
  })
})

//[PUT]
routerRespuestaPreguntaFinal.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const respuesta_encuesta_final = await sequelize.respuesta_encuesta_final.findOne({ where: { id: req.body.id } })
    if (respuesta_encuesta_final){
      respuesta_encuesta_final.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de respuesta_encuesta_final', err);
      })
    } else {
        console.log("No existe respuesta_encuesta_final con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerRespuestaPreguntaFinal;