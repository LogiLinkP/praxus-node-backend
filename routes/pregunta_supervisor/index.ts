export { };

const { pregunta_supervisor, practica, config_practica, modalidad, carrera, aptitud } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerPregSupervisor = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] mostrar todas las preguntas de supervisor
routerPregSupervisor.get('/todas', (req:any, res:any) => {
  console.log("Obteniendo todos los preguntas de supervisor")
  pregunta_supervisor.findAll().then((resultados:any) => {
    res.send(resultados)
  })
  .catch((err:any) => {
    console.log('Error al mostrar preguntas de supervisor', err);
    res.send('Error al mostrar preguntas de supervisor', err);
  })
})

//[GET] obtener todas las preguntas con id_config_practica
routerPregSupervisor.get('/id_config_practica', (req:any, res:any) => {
    console.log("Obteniendo todas las preguntas de practica con id_config_practica: ", req.query.id)
    pregunta_supervisor.findAll({
        where: {
            id_config_practica: req.query.id
        }
    })
    .then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar todas las preguntas de practica', err);
      res.send('Error al mostrar todas las preguntas de practica', err);
    })
})

//[GET] obtener aptitudes de una practica
routerPregSupervisor.get('/aptitudes', (req:any, res:any) => {
    pregunta_supervisor.findOne({
        where: {
            id_config_practica: req.query.id,
            tipo_respuesta: "evaluacion"
        }
    })
    .then((resultados:any) => {
      res.status(200).json(resultados);
    })
    .catch((err:any) => {
      res.status(500).json(err);
    })
})

//[GET] para obtener una preguntas de supervisor con su ID
routerPregSupervisor.get('', (req: any, res: any) => {
    console.log("Obteniendo preguntas de supervisor con id: ", req.query.id)
    pregunta_supervisor.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener preguntas de supervisor', err);
        })
})

//[DELETE] Eliminar preguntas de supervisor con su ID
routerPregSupervisor.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando preguntas de supervisor con id: ", req.query.id)
    pregunta_supervisor.destroy({
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
      console.log('Error al eliminar preguntas de supervisor', err);
    })
})

//[DELETE] Eliminar por config_practica
routerPregSupervisor.delete('/eliminar_config', (req: any, res: any) => {
    console.log("Eliminando preguntas de practica con id_config_practica: ", req.query.id)
    pregunta_supervisor.destroy({
      where: {
        id_config_practica: req.query.id
      }
    })
      .then((resultados: any) => {
        console.log(resultados);
        res.status(200).json(resultados);
      })
      .catch((err: any) => {
        res.status(500).json(err);
        console.log('Error al eliminar preguntas de practica', err);
      })
})

//[POST] Crear una preguntas de supervisor con los datos recibidos
routerPregSupervisor.post('/crear', jsonParser, (req: any, res: any) => {
    const {id_config_practica, enunciado, tipo_respuesta, opciones, fija,rango} = req.body;
    console.log("Request de creacion de preguntas de supervisor recibida");
    pregunta_supervisor.create({
        id_config_practica: id_config_practica,
        enunciado: enunciado,
        tipo_respuesta: tipo_respuesta,
        opciones: opciones,
        fija: fija,
        rango: rango
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.status(200).json(resultados);
    })
    .catch((err:any) => {
        console.log('Error al crear preguntas de supervisor', err);
        res.status(500).json({ message: "Error al crear preguntas de supervisor", error: err});
    })
})

routerPregSupervisor.post('/aptitudes', jsonParser, async (req: any, res: any) => {
  let { id_practica } =req.body;
  console.log(1, id_practica, typeof id_practica, typeof parseInt(id_practica))
  try{
    console.log(2)
    let _data = await practica.findOne({
      where: {
        id: id_practica
      }
      ,include: [{model: config_practica,
         include: [{model: carrera, 
          include: [{model: aptitud}]
        }]
      }]
    })
    if(_data){
      return res.status(200).json({data: _data});
    }
    else{
      return res.status(400).json({ message: "No se encontraron las aptitudes de la práctica"});
    }
  }
  catch(err){
    return res.status(500).json({ message: "Error al obtener la práctica", error: err});
  }
})

module.exports = routerPregSupervisor;