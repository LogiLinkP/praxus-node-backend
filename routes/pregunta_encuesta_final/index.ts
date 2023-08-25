export { };

const { pregunta_encuesta_final } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerPregEncuesta = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] mostrar todas las preguntas de practica
routerPregEncuesta.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todas las preguntas de practica")
    pregunta_encuesta_final.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar todas las preguntas de encuesta final', err);
      res.send('Error al mostrar todas las preguntas de encuesta final', err);
    })
})

//[GET] obtener todas las preguntas con id_config_practica
routerPregEncuesta.get('/id_config_practica', (req:any, res:any) => {
    console.log("Obteniendo todas las preguntas de practica con id_config_practica: ", req.query.id_config_practica)
    pregunta_encuesta_final.findAll({
        where: {
            id_config_practica: req.query.id_config_practica
        }
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.status(200).json(resultados);
    })
    .catch((err:any) => {
        console.log('Error al obtener preguntas de practica', err);
        res.status(500).json({ message: "Error al obtener preguntas de practica", error: err});
    })
})

//[GET] para obtener una pregunta de practica con su ID
routerPregEncuesta.get('', (req: any, res: any) => {
    console.log("Obteniendo preguntas de practica de id: ", req.query.id)
    pregunta_encuesta_final.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener preguntas de practica', err);
        })
})

//[POST] Crear preguntas de practica con los datos recibidos
routerPregEncuesta.post('/crear', jsonParser, (req: any, res: any) => {
    const {id_config_practica,enunciado, tipo_respuesta, opciones} = req.body;
    console.log("Request de creacion de preguntas de practica recibida");
    // hacer post a python backend
    pregunta_encuesta_final.create({
        id_config_practica: id_config_practica,
        enunciado: enunciado,
        tipo_respuesta: tipo_respuesta,
        opciones: opciones
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.status(200).json({ message: "preguntas de practica creada" });
    })
    .catch((err:any) => {
        console.log('Error al crear preguntas de practica', err);
        res.status(500).json({ message: "Error al crear preguntas de practica", error: err});
    })
})

//[DELETE] Eliminar preguntas de practica con su ID
routerPregEncuesta.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando preguntas de practica con id: ", req.query.id)
    pregunta_encuesta_final.destroy({
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
      console.log('Error al eliminar preguntas de practica', err);
    })
})

module.exports = routerPregEncuesta;