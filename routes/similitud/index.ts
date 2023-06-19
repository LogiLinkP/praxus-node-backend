export { };

require('dotenv').config()

const { Router } = require('express');
var bodyParser = require('body-parser');

const sequelize = require('../../db');

const routerSimilitud = new Router();
const jsonParser = bodyParser.json();

// Import the axios library
const axios = require('axios');

// post para recibir request de calculo de consistencia desde el front
routerSimilitud.post('/consistencia', jsonParser, async (req: any, res: any) => {
    const {texto1, texto2, id_alumno_practica} = req.body;
    console.log("Request de calculo de consistencia recibida");
    console.log(req.body);
    var consistencia = 0.0;

    // hacer post a python backend
    const payload = {
        texto1: texto1,
        texto2: texto2
      };
    await axios.post(process.env.PYTHONBE_CONSISTENCY, payload)
    .then(async (response: any) => {
      console.log("Respuesta recibida desde python backend");
      consistencia = await response.data.score;
      console.log("La consistencia del informe es:",consistencia);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
    
    // guardar en la BD
    const estuCursaPract = await sequelize.estudiante_cursa_practica.findOne({ where: { id: id_alumno_practica } })
    if (estuCursaPract){
      console.log("Actualizando consistencia de informe para el id", id_alumno_practica, "con consistencia", consistencia);
        // actualizar estudiante_cursa_practica
      estuCursaPract.update({ consistencia_informe: consistencia })
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar estudiante_cursa_practica', err);
      })
    } else {
        console.log("No existe estudiante_cursa_practica con id: ", req.query.id)
        res.sendStatus(404)
    }
})

routerSimilitud.post('/comparacion_keywords', jsonParser, (req: any, res: any) => {
  const {texto1, texto2, id_alumno_practica} = req.body;
  console.log("Request de calculo con keywords recibida");
  console.log(req.body);
  // hacer post a python backend
  const payload = {
      texto1: texto1,
      texto2: texto2
    };
  axios.post(process.env.PYTHONBE_KEYWORDS, payload)
  .then((response: any) => {
    console.log("Respuesta recibida desde python backend");
    res.status(200).send(response.data);
  })
  .catch((error: any) => {
    console.error(error);
    res.status(500).send('Error occurred');
  });
  // POR AHORA NO SE GUARDA ESTO
})

routerSimilitud.post('/consistencia_evaluacion_informe', jsonParser, (req: any, res: any) => {
  const {texto, puntaje, puntaje_min, puntaje_max, id_alumno_practica} = req.body;
  console.log("Request de calculo de consistencia_evaluacion_informe recibida");
  console.log(req.body);
  // hacer post a python backend
  const payload = {
      texto: texto,
      puntaje: puntaje,
      puntaje_min: puntaje_min,
      puntaje_max: puntaje_max
    };
  axios.post(process.env.PYTHONBE_EVAL_INFORME, payload)
  .then((response: any) => {
    console.log("Respuesta recibida desde python backend");
    res.status(200).send(response.data);
  })
  .catch((error: any) => {
    console.error(error);
    res.status(500).send('Error occurred');
  });
  // guardar en la BD
})

module.exports = routerSimilitud;