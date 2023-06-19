export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerPregPractica = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] mostrar todas las preguntas de practica
routerPregPractica.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todas las preguntas de practica")
    sequelize.preguntas_practicas.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar todas las preguntas de practica', err);
      res.send('Error al mostrar todas las preguntas de practica', err);
    })
})

//[GET] para obtener una pregunta de practica con su ID
routerPregPractica.get('', (req: any, res: any) => {
    console.log("Obteniendo preguntas de practica de id: ", req.query.id)
    sequelize.preguntas_practicas.findOne({
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
routerPregPractica.post('/crear', jsonParser, (req: any, res: any) => {
    const {enunciado, tipo} = req.body;
    console.log("Request de creacion de preguntas de practica recibida");
    // hacer post a python backend
    sequelize.preguntas_practicas.create({
        enunciado: enunciado,
        tipo: tipo
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.send("preguntas de practica creado");
    })
    .catch((err:any) => {
        console.log('Error al crear preguntas de practica',err);
    })
})

//[DELETE] Eliminar preguntas de practica con su ID
routerPregPractica.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando preguntas de practica con id: ", req.query.id)
    sequelize.preguntas_practicas.destroy({
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

module.exports = routerPregPractica;