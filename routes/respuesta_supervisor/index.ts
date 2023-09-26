import { text } from "stream/consumers";
import { Op } from "sequelize";

export { };

const { respuesta_supervisor, pregunta_supervisor, practica, informe, config_informe, pregunta_informe } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerRespuesta_supervisor = new Router();
const axios = require('axios');

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerRespuesta_supervisor.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await respuesta_supervisor.findOne({
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
routerRespuesta_supervisor.get('/todos', async (req: any, res: any) => {
  try {
    const data = await respuesta_supervisor.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerRespuesta_supervisor.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando respuesta_supervisor con id: ", req.query.id)
  respuesta_supervisor.destroy({
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
      console.log('Error al eliminar respuesta_supervisor', err);
    })
})

//[POST] Crear uno
routerRespuesta_supervisor.post('/responder_encuesta', jsonParser, async (req: any, res: any) => {
  // se asume que los ids de preguntas y las respuestas vienen en el mismo orden, es decir, respuesta[i] está relacionado a pregunta[i]
  const { ids_preguntas_supervisor, id_practica, respuestas } = req.body; 

  console.log("Ids_preguntas_supervisor:", ids_preguntas_supervisor);
  console.log("Id_practica:", id_practica);
  console.log("Request de respuesta_supervisor - las respuestas son:", respuestas);

  const _informes = await informe.findAll({
    where: {
      id_practica: id_practica,
      key: { [Op.ne]: null }
    },
    include: {model: config_informe, require: true , include: {model: pregunta_informe, require: true}}
  })

  let texto_informes = "";
  let texto_respuestas = "";
  let suma_evaluaciones = 0;
  let cantidad_evaluaciones = 0;

  // Concatenar informes para calculo de consistencia (tomar solo respuestas abiertas)
  if (_informes.length > 0) {
    
    for (let i = 0; i < _informes.length; i++) {
      console.log("INFORME: ", _informes[i]);
      let respuestas_informe = _informes[i].key // la columna key guarda todas las respuestas del informe
      for (let j = 0; j < Object.keys(respuestas_informe).length; j++) {
        // find the pregunta_informe tha has the same id as the one in the informe
        let _pregunta_informe = _informes[i].config_informe.pregunta_informes.find((pregunta: any) => pregunta.id == Object.keys(respuestas_informe)[j]);
        if (_pregunta_informe.tipo_respuesta == "abierta") {
          texto_informes += respuestas_informe[Object.keys(respuestas_informe)[j]] + ". ";
        }
      }
    }
    texto_informes = texto_informes.slice(0, -1);
  }

  // Crear respuestas en la bd y concatenar textos de respuestas abiertas para calculo de consistencia
  for (let i = 0; i < ids_preguntas_supervisor.length; i++) {
    try {
      await respuesta_supervisor.create({
        id_pregunta_supervisor: ids_preguntas_supervisor[i],
        id_practica: id_practica,
        respuesta: respuestas[i]
      })

      const _pregunta_supervisor = await pregunta_supervisor.findOne({ where: { id: ids_preguntas_supervisor[i] } })

      if (_pregunta_supervisor.tipo_respuesta == "abierta") {
        texto_respuestas += respuestas[i] + ". ";
      }
      else if (_pregunta_supervisor.tipo_respuesta == "evaluacion") {
        suma_evaluaciones += parseInt(respuestas[i]);
        cantidad_evaluaciones += 1;
      }
    }
    catch (error) {
      console.log('Error al crear respuesta_supervisor', error);
      res.status(500).json({ message: "Error interno" });
    }
  }

  console.log("INFORMES:")
  console.log(texto_informes);
  console.log("RESPUESTAS:")
  console.log(texto_respuestas);

  // ENVIAR INFORMES Y RESPUESTAS PARA CALCULO DE CONSISTENCIA:

  if (texto_respuestas != "" && texto_informes != "") {
    let consistencia_informe = await axios.post(process.env.PYTHONBE_CONSISTENCY, {
      texto1: texto_informes,
      texto2: texto_respuestas
    });

    console.log("CONSISTENCIA INFORME: ", consistencia_informe.data);

    console.log(consistencia_informe.data);
    await practica.update({
      consistencia_informe: consistencia_informe.data.score,
      interpretacion_informe: consistencia_informe.data.interpretacion
    }, {
      where: {
        id: id_practica
      }
    });
  }

  if (cantidad_evaluaciones > 0 && texto_respuestas != "") {
    let consistencia_evaluacion = await axios.post(process.env.PYTHONBE_EVAL_INFORME, {
      texto: texto_respuestas,
      puntaje: +suma_evaluaciones / cantidad_evaluaciones,
      puntaje_min: 1,
      puntaje_max: 5
    });
    console.log("RESPUESTA DE CONSISTENCIA EVAL:", consistencia_evaluacion.data);
    await practica.update({
      consistencia_nota: consistencia_evaluacion.data.evaluacion.similitud,
      interpretacion_nota: consistencia_evaluacion.data.interpretacion,
      nota_eval: +suma_evaluaciones / cantidad_evaluaciones
    }, {
      where: {
        id: id_practica
      }
    });
  }
  await practica.update({
    estado: "Evaluada",
    fecha_termino: new Date()
  }, {
    where: {
      id: id_practica
    }
  });
  res.status(200).json({ message: "Data recibida" });

})

//[PUT]
routerRespuesta_supervisor.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Respuesta_supervisor = await respuesta_supervisor.findOne({ where: { id: req.body.id } })
  if (Respuesta_supervisor) {
    // actualizar practica
    Respuesta_supervisor.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar respuesta_supervisor', err);
      })
  } else {
    console.log("No existe respuesta_supervisor con id: ", req.query.id);
    res.sendStatus(404);
  }
})

module.exports = routerRespuesta_supervisor;

