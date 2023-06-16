export { };

const { Router } = require('express');
var bodyParser = require('body-parser');

const routerConsistencia = new Router();
const jsonParser = bodyParser.json();

// Import the axios library
const axios = require('axios');

// post para recibir request de calculo de consistencia desde el front
routerConsistencia.post('/consistencia', jsonParser, (req: any, res: any) => {
    const {texto1, texto2, id_alumno_practica} = req.body;
    console.log("Request de calculo de consistencia recibida");
    console.log(req.body);
    // hacer post a python backend
    const payload = {
        texto1: texto1,
        texto2: texto2
      };
    axios.post('http://localhost:5000/nlp/consistencia', payload)
    .then((response: any) => {
      console.log("Respuesta recibida desde python backend");
      res.status(200).send(response.data);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
    // GUARDAR CONSISTENCIA EN LA BASE DE DATOS?
})

routerConsistencia.post('/comparacion_keywords', jsonParser, (req: any, res: any) => {
  const {texto1, texto2, id_alumno_practica} = req.body;
  console.log("Request de calculo con keywords recibida");
  console.log(req.body);
  // hacer post a python backend
  const payload = {
      texto1: texto1,
      texto2: texto2
    };
  axios.post('http://localhost:5000/nlp/comparacion_keywords', payload)
  .then((response: any) => {
    console.log("Respuesta recibida desde python backend");
    res.status(200).send(response.data);
  })
  .catch((error: any) => {
    console.error(error);
    res.status(500).send('Error occurred');
  });
  // GUARDAR CONSISTENCIA EN LA BASE DE DATOS?
})

routerConsistencia.post('/consistencia_evaluacion_informe', jsonParser, (req: any, res: any) => {
  const {texto, puntaje, puntaje_min, puntaje_max} = req.body;
  console.log("Request de calculo de consistencia_evaluacion_informe recibida");
  console.log(req.body);
  // hacer post a python backend
  const payload = {
      texto: texto,
      puntaje: puntaje,
      puntaje_min: puntaje_min,
      puntaje_max: puntaje_max
    };
  axios.post('http://localhost:5000/nlp/consistencia_evaluacion_informe', payload)
  .then((response: any) => {
    console.log("Respuesta recibida desde python backend");
    res.status(200).send(response.data);
  })
  .catch((error: any) => {
    console.error(error);
    res.status(500).send('Error occurred');
  });
  // GUARDAR CONSISTENCIA EN LA BASE DE DATOS?
})

module.exports = routerConsistencia;