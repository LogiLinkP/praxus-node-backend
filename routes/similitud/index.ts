import { info } from "console";

export { };

require('dotenv').config()

const { Router } = require('express');
var bodyParser = require('body-parser');

const sequelize = require('../../db');
const {
  practica, informe,
  respuesta_supervisor, pregunta_supervisor,
  config_informe, pregunta_informe } = require("../../models");

const routerSimilitud = new Router();
const jsonParser = bodyParser.json();

// Import the axios library
const axios = require('axios');

//[POST] Recibir request de calculo de consistencia desde el front
routerSimilitud.post('/consistencia', jsonParser, async (req: any, res: any) => {
  const { texto1, texto2, id_alumno_practica } = req.body;
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
      console.log("La consistencia del informe es:", consistencia);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });

  // guardar en la BD
  const estuCursaPract = await sequelize.estudiante_cursa_practica.findOne({ where: { id: id_alumno_practica } })
  if (estuCursaPract) {
    console.log("Actualizando consistencia de informe para el id", id_alumno_practica, "con consistencia", consistencia);
    // actualizar estudiante_cursa_practica
    estuCursaPract.update({ consistencia_informe: consistencia })
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar estudiante_cursa_practica', err);
      })
  } else {
    console.log("No existe estudiante_cursa_practica con id: ", req.query.id)
    res.sendStatus(404)
  }
})

routerSimilitud.post('/comparacion_keywords', jsonParser, (req: any, res: any) => {
  const { texto1, texto2, id_alumno_practica } = req.body;
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

routerSimilitud.post('/consistencia_evaluacion_informe', jsonParser, async (req: any, res: any) => {
  const { texto, puntaje, puntaje_min, puntaje_max, id_alumno_practica } = req.body;
  console.log("Request de calculo de consistencia_evaluacion_informe recibida");
  console.log(req.body);
  var consistencia = 0.0;
  var neg = 0.0;
  var pos = 0.0;
  var neu = 0.0;
  var producto = 0.0
  var datos;
  // hacer post a python backend
  const payload = {
    texto: texto,
    puntaje: puntaje,
    puntaje_min: puntaje_min,
    puntaje_max: puntaje_max
  };
  await axios.post(process.env.PYTHONBE_EVAL_INFORME, payload)
    .then(async (response: any) => {
      console.log("Respuesta recibida desde python backend");
      datos = await response.data;
      neg = datos.informe.probas.NEG;
      pos = datos.informe.probas.POS;
      neu = datos.informe.probas.NEU;
      console.log("sentimientos de informe (pos, neg, neu):", pos, neg, neu);
      console.log("evaluacion:", datos.evaluacion.puntaje);
      producto = neg * 0.2 + pos + neu * 0.6; // ESTOS NUMEROS PUEDEN AJUSTARSE
      // consistencia is the max between producto and puntaje
      if (producto > datos.evaluacion.puntaje) {
        consistencia = datos.evaluacion.puntaje / producto;
      } else {
        consistencia = producto / datos.evaluacion.puntaje;
      }
      console.log("La consistencia del informe es:", consistencia);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });

  // guardar en la BD
  const estuCursaPract = await sequelize.estudiante_cursa_practica.findOne({ where: { id: id_alumno_practica } })
  if (estuCursaPract) {
    console.log("Actualizando consistencia de informe para el id", id_alumno_practica, "con consistencia", consistencia);
    // actualizar estudiante_cursa_practica
    estuCursaPract.update({ consistencia_nota: consistencia })
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar estudiante_cursa_practica', err);
      })
  } else {
    console.log("No existe estudiante_cursa_practica con id: ", req.query.id)
    res.sendStatus(404)
  }
});

routerSimilitud.put('/frases_representativas_practica/:id_practica', jsonParser, async (req: any, res: any) => {
  const { id_practica } = req.params;
  if (!id_practica) {
    res.status(400).json({ error: 'Practica no especificada' });
    return;
  }
  try {
    const _practica = await practica.findOne({
      where: { id: id_practica },
      include: [
        {
          model: informe,
          required: true,
          include: [
            {
              model: config_informe,
              required: true,
              include: [
                {
                  model: pregunta_informe,
                  required: true,
                  where: { tipo_respuesta: 'abierta' }
                }
              ]
            }
          ]
        },
        {
          model: respuesta_supervisor,
          required: true,
          include: [
            {
              model: pregunta_supervisor,
              required: true,
              where: { tipo_respuesta: 'abierta' }
            }
          ]
        }
      ]
    });
    if (!_practica) {
      res.status(404).json({ error: 'Practica no encontrada' });
      return;
    }

    let textos_informes: any = [];
    let orden_informes: string[][] = [];
    for (let informe of _practica.informes) {
      let ids_preguntas_informe = informe.config_informe.pregunta_informes.map((elem: any) => elem.id.toString());
      ids_preguntas_informe.forEach((id_pregunta: string) => {
        orden_informes.push([informe.id.toString(), id_pregunta]);
        textos_informes.push(informe.key[id_pregunta])
      });
    }

    let orden_supervisor: string[] = [];
    let textos_supervisor = _practica.respuesta_supervisors.map((elem: any) => {
      orden_supervisor.push(elem.id.toString());
      return elem.respuesta
    });

    if (
      _practica.key_fragmentos && Object.keys(_practica.key_fragmentos).length > 0 &&
      textos_informes.length == Object.keys(_practica.key_fragmentos.informes).length &&
      textos_supervisor.length == Object.keys(_practica.key_fragmentos.supervisor).length
    ) {
      return res.status(200).json(_practica.key_fragmentos);
    }

    const url = `${process.env.URL_PYTHON_BACKEND}/nlp/frases_representativas_multi?cantidad=${req.query.cantidad ?? 10}&textos=`;

    const string_textos_informes = textos_informes.join('|||');
    let _response_informes = axios.get(url + string_textos_informes);

    const string_textos_supervisor = textos_supervisor.join('|||');
    let _response_supervisor = axios.get(url + string_textos_supervisor);

    const [response_informes, response_supervisor] = await Promise.all([_response_informes, _response_supervisor])

    let _informe: any = {};
    let contador = 0;
    _practica.informes.forEach((elem: any) => {
      _informe[elem.id] = {};
      elem.config_informe.pregunta_informes.forEach((pregunta: any) => {
        _informe[elem.id][pregunta.id] = response_informes.data[contador];
        contador++;
      });
    });

    let _supervisor: any = {};
    contador = 0;
    _practica.respuesta_supervisors.forEach((elem: any) => {
      _supervisor[elem.id] = response_supervisor.data[contador];
      contador++;
    });

    await _practica.update({
      key_fragmentos: {
        "informes": _informe,
        "supervisor": _supervisor
      }
    });
    return res.status(200).json(_practica.key_fragmentos);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

routerSimilitud.get('/frases_representativas_practica/:id_practica', jsonParser, async (req: any, res: any) => {
  const { id_practica } = req.params;
  if (!id_practica) {
    res.status(400).json({ error: 'Practica no especificada' });
    return;
  }
  try {
    const _practica = await practica.findOne({
      where: { id: id_practica },
      include: [
        {
          model: informe,
          required: true,
          include: [
            {
              model: config_informe,
              required: true,
              include: [
                {
                  model: pregunta_informe,
                  required: true,
                  where: { tipo_respuesta: 'abierta' }
                }
              ]
            }
          ]
        },
        {
          model: respuesta_supervisor,
          required: true,
          include: [
            {
              model: pregunta_supervisor,
              required: true,
              where: { tipo_respuesta: 'abierta' }
            }
          ]
        }
      ]
    });
    if (!_practica) {
      res.status(404).json({ error: 'Practica no encontrada' });
      return;
    }

    let textos_informes: any = [];
    let orden_informes: string[][] = [];
    for (let informe of _practica.informes) {
      let ids_preguntas_informe = informe.config_informe.pregunta_informes.map((elem: any) => elem.id.toString());
      ids_preguntas_informe.forEach((id_pregunta: string) => {
        orden_informes.push([informe.id.toString(), id_pregunta]);
        textos_informes.push(informe.key[id_pregunta])
      });
    }

    let orden_supervisor: string[] = [];
    let textos_supervisor = _practica.respuesta_supervisors.map((elem: any) => {
      orden_supervisor.push(elem.id.toString());
      return elem.respuesta
    });

    if (
      _practica.key_fragmentos && Object.keys(_practica.key_fragmentos).length > 0 &&
      textos_informes.length == Object.keys(_practica.key_fragmentos.informes).length &&
      textos_supervisor.length == Object.keys(_practica.key_fragmentos.supervisor).length
    ) {
      let frags_informe = [];
      let frags_supervisor = [];
      for (let elem of orden_informes) {
        frags_informe.push(_practica.key_fragmentos.informes[elem[0]][elem[1]]);
      }
      for (let elem of orden_supervisor) {
        frags_supervisor.push(_practica.key_fragmentos.supervisor[elem]);
      }
      return res.status(200).json({
        informes: [frags_informe, textos_informes],
        supervisor: [frags_supervisor, textos_supervisor]
      });
    }

    const url = `${process.env.URL_PYTHON_BACKEND}/nlp/frases_representativas_multi?cantidad=${req.query.cantidad ?? 10}&textos=`;

    const string_textos_informes = textos_informes.join('|||');
    let _response_informes = axios.get(url + string_textos_informes);

    const string_textos_supervisor = textos_supervisor.join('|||');
    let _response_supervisor = axios.get(url + string_textos_supervisor);

    const [response_informes, response_supervisor] = await Promise.all([_response_informes, _response_supervisor])

    let _informe: any = {};
    let contador = 0;
    _practica.informes.forEach((elem: any) => {
      _informe[elem.id] = {};
      elem.config_informe.pregunta_informes.forEach((pregunta: any) => {
        _informe[elem.id][pregunta.id] = response_informes.data[contador];
        contador++;
      });
    });

    let _supervisor: any = {};
    contador = 0;
    _practica.respuesta_supervisors.forEach((elem: any) => {
      _supervisor[elem.id] = response_supervisor.data[contador];
      contador++;
    });

    await _practica.update({
      key_fragmentos: {
        "informes": _informe,
        "supervisor": _supervisor
      }
    })

    return res.status(200).json({
      informes: response_informes.status == 200 ? [response_informes.data, textos_informes] : null,
      supervisor: response_supervisor.status == 200 ? [response_supervisor.data, textos_supervisor] : null
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

routerSimilitud.get('/frases_representativas', jsonParser, async (req: any, res: any) => {
  // get texto and cantidad from query string
  const { texto } = req.query;
  if (!texto) {
    res.status(400).json({ error: 'Texto no especificado' });
    return;
  }
  try {
    const response = await axios.get(`${process.env.URL_PYTHON_BACKEND}/nlp/frases_representativas?texto=${texto}&cantidad=${req.query.cantidad ?? 10}`)
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }

});

routerSimilitud.post('/texto_mas_repetido', jsonParser, async (req: any, res: any) => {
  const { texto1, texto2, id_alumno_practica } = req.body;
  const payload = { texto1: texto1, texto2: texto2 };
  await axios.post(process.env.PYTHONBE_MOST_REPEATED, payload)
    .then((response: any) => {
      console.log("Respuesta recibida desde python backend");
      res.status(200).send(response.data);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
})

routerSimilitud.post('/indice_repeticion', jsonParser, async (req: any, res: any) => {
  const { texto1, texto2, id_alumno_practica } = req.body;
  const payload = { texto1: texto1, texto2: texto2 };
  await axios.post(process.env.PYTHONBE_REPETITION_INDEX, payload)
    .then((response: any) => {
      console.log("Respuesta recibida desde python backend");
      res.status(200).send(response.data);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
})

routerSimilitud.post('/textos_repetidos', jsonParser, async (req: any, res: any) => {
  const { texto1, id_alumno_practica } = req.body;
  const payload = { texto1: texto1 };
  await axios.post(process.env.PYTHONBE_REPEATED_SECTIONS, payload)
    .then((response: any) => {
      console.log("Respuesta recibida desde python backend");
      res.status(200).send(response.data);
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
})

module.exports = routerSimilitud;