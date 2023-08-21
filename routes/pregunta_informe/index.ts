export { };

const { pregunta_informe } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerPreguntaInforme = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un pregunta_informe con su ID
routerPreguntaInforme.get('', (req: any, res: any) => {
    console.log("Obteniendo pregunta_informe de id: ", req.query.id)
    pregunta_informe.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener pregunta_informe', err);
        })
})

//[GET] mostrar todos los pregunta_informe
routerPreguntaInforme.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todas las pregunta_informe")
    pregunta_informe.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar pregunta_informe', err);
      res.send('Error al mostrar pregunta_informe', err)
    })
})

//[DELETE] Eliminar pregunta_informe con su ID
routerPreguntaInforme.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando pregunta_informe con id: ", req.query.id)
    pregunta_informe.destroy({
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
        console.log('Error al eliminar pregunta_informe', err);
    })
})

//[POST] Crear un pregunta_informe con los datos recibidos
routerPreguntaInforme.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_config_informe, enunciado, tipo_respuesta, opciones} = req.body;
  console.log("Request de creacion de pregunta_informe recibida");
  pregunta_informe.create({
      id_config_informe: id_config_informe,
      enunciado: enunciado,
      tipo_respuesta: tipo_respuesta,
      opciones: opciones
  })
  .then((resultados:any) => {
      res.send("pregunta_informe creado");
  })
  .catch((err:any) => {
      console.log('Error al crear pregunta_informe',err);
  })
})

//[PUT]
routerPreguntaInforme.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const Pregunta_informe = await pregunta_informe.findOne({ where: { id: req.body.id } })
    if (Pregunta_informe){
      pregunta_informe.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de pregunta_informe', err);
      })
    } else {
        console.log("No existe pregunta_informe con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerPreguntaInforme;