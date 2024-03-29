import { Op } from "sequelize";
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
  console.log("id_practica", id_practica)
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
          required: false,
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
      await practica.update(
        {
          key_fragmentos: {
            "informes": {},
            "supervisor": {}
          }
        }, {
        where: {
          id: id_practica
        }
      }
      );

      res.status(200).json({
        "informes": {},
        "supervisor": {}
      });
      return;
    }
    let textos_informes: any = [];
    let orden_informes: string[][] = [];
    for (let informe of _practica.informes) {
      let ids_preguntas_informe = informe.config_informe.pregunta_informes.map((elem: any) => elem.id.toString());
      ids_preguntas_informe.forEach((id_pregunta: string) => {
        if (informe.key) {
          orden_informes.push([informe.id.toString(), id_pregunta]);
          textos_informes.push(informe.key[id_pregunta])
        }
      });
    }

    let orden_supervisor: string[] = [];
    let textos_supervisor: string[] = _practica.respuesta_supervisors.map((elem: any) => {
      orden_supervisor.push(elem.id.toString());
      return elem.respuesta
    });

    let contador_respuestas_informes = 0;
    if (_practica.key_fragmentos) {
      for (let idxInf in _practica.key_fragmentos.informes) {
        for (let idxPreg in _practica.key_fragmentos.informes[idxInf])
          if (_practica.key_fragmentos.informes[idxInf][idxPreg].length > 0)
            contador_respuestas_informes += 1;
      }
    }


    if (
      _practica.key_fragmentos && Object.keys(_practica.key_fragmentos).length > 0 &&
      textos_informes.length == contador_respuestas_informes &&
      textos_supervisor.length == Object.keys(_practica.key_fragmentos.supervisor).length
    ) {
      // console.log("NO CONSULTANDO PYTHON")
      return res.status(200).json(_practica.key_fragmentos);
    }
    // console.log("HOLA HOLA ESTOY HACIENDO UNA REQUEST AL PYTHON", textos_supervisor)
    const url = `${process.env.URL_PYTHON_BACKEND}/nlp/frases_representativas_multi?cantidad=${req.query.cantidad ?? 10}&textos=`;

    const chunk_size = 5;

    // procesar informes
    let response_informes: any = [];
    for (let i = 0; i < textos_informes.length; i = i + chunk_size) {
      let informes_a_procesar = textos_informes.slice(i, i + chunk_size);
      const string_textos_informes = informes_a_procesar.join('|||');
      let _response_informes = await axios.get(url + string_textos_informes);
      response_informes.push(..._response_informes.data)
    }

    // procesar textos supervisor
    let response_supervisor: any = [];
    for (let i = 0; i < textos_supervisor.length; i = i + chunk_size) {
      let informes_sup_a_procesar = textos_supervisor.slice(i, i + chunk_size);
      const string_textos_supervisor = informes_sup_a_procesar.join('|||');
      let _response_supervisor = await axios.get(url + string_textos_supervisor);
      response_supervisor.push(..._response_supervisor.data)
    }

    // const [response_informes, response_supervisor] = await Promise.all([_response_informes, _response_supervisor])

    let _informe: any = {};
    orden_informes.forEach((par_ids_inf_preg: string[], indice) => {
      let [idx_inf, idx_preg] = par_ids_inf_preg;
      if (!_informe.hasOwnProperty(idx_inf)) _informe[idx_inf] = {};
      _informe[idx_inf][idx_preg] = response_informes[indice];
    });

    let _supervisor: any = {};
    orden_supervisor.forEach((id_resp_supervisor: string, indice) => {
      _supervisor[id_resp_supervisor] = response_supervisor[indice];
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
      res.status(200).json({
        informes: [[], []],
        supervisor: [[], []]
      });
      return;
    }

    let textos_informes: any = [];
    let orden_informes: string[][] = [];
    for (let informe of _practica.informes) {
      let ids_preguntas_informe = informe.config_informe.pregunta_informes.map((elem: any) => elem.id.toString());
      ids_preguntas_informe.forEach((id_pregunta: string) => {
        if (informe.key) {
          orden_informes.push([informe.id.toString(), id_pregunta]);
          textos_informes.push(informe.key[id_pregunta])
        }
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

// routerSimilitud.post('/texto_mas_repetido', jsonParser, async (req: any, res: any) => {
//   const { texto1, texto2, id_alumno_practica } = req.body;
//   const payload = { texto1: texto1, texto2: texto2 };
//   await axios.post(process.env.PYTHONBE_MOST_REPEATED, payload)
//     .then((response: any) => {
//       console.log("Respuesta recibida desde python backend");
//       res.status(200).send(response.data);
//     })
//     .catch((error: any) => {
//       console.error(error);
//       res.status(500).send('Error occurred');
//     });
// })

// routerSimilitud.post('/indice_repeticion', jsonParser, async (req: any, res: any) => {
//   const { texto1, texto2, id_alumno_practica } = req.body;
//   const payload = { texto1: texto1, texto2: texto2 };
//   await axios.post(process.env.PYTHONBE_REPETITION_INDEX, payload)
//     .then((response: any) => {
//       console.log("Respuesta recibida desde python backend");
//       res.status(200).send(response.data);
//     })
//     .catch((error: any) => {
//       console.error(error);
//       res.status(500).send('Error occurred');
//     });
// })

routerSimilitud.post('/textos_repetidos', jsonParser, async (req: any, res: any) => {
  const { id_practica } = req.body;
  if (!id_practica) {
    res.status(400).json({ error: 'Practica no especificada' });
    return;
  }
  try {
    const Practica = await practica.findOne({
      where: { id: id_practica },
      include: [
        {
          model: informe,
          required: false,
          include: [
            {
              model: config_informe,
              required: false,
              include: [
                {
                  model: pregunta_informe,
                  required: false,
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
    if (!Practica) {
      res.status(404).json({ error: 'Practica no encontrada' });
      return;
    }
    let textos_informes: string[] = [];
    // let orden_informes: string[][] = [];
    for (let informe of Practica.informes) {
      let ids_preguntas_informe = informe.config_informe.pregunta_informes.map((elem: any) => elem.id.toString());
      ids_preguntas_informe.forEach((id_pregunta: string) => {
        // orden_informes.push([informe.id.toString(), id_pregunta]);
        if (informe.key)
          textos_informes.push(informe.key[id_pregunta])
      });
    }
    if (textos_informes.length == 0) {
      Practica.update({
        key_repeticiones: [],
        indice_repeticion: 0
      });
      return res.status(200).json({
        key_repeticiones: [],
        indice_repeticion: 0
      });
    }
    const response = await axios.post(process.env.PYTHONBE_REPEATED_SECTIONS, {
      texto1: textos_informes
    });
    let cant_palabras_repetidas = 0;
    for (let par of response.data.registro) {
      cant_palabras_repetidas += par[1] * par[0].split(" ").length;
    }
    let cant_palabras_total = 0
    for (let texto of textos_informes) {
      cant_palabras_total += texto.split(" ").length;
    }
    Practica.update({
      key_repeticiones: response.data.registro,
      indice_repeticion: cant_palabras_total == 0 ? 0 : cant_palabras_repetidas / cant_palabras_total
    })
    return res.status(200).json({
      key_repeticiones: response.data.registro,
      indice_repeticion: cant_palabras_total == 0 ? 0 : cant_palabras_repetidas / cant_palabras_total
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error occurred' });
  }
})

routerSimilitud.post('/repeticion_respuestas_informe', jsonParser, async (req: any, res: any) => {
  const { id_practica, id_informe } = req.body;
  const textos = [];
  let resx: any;
  try {
    resx = await sequelize.pregunta_informe.findAll({
      where: { id_informe: id_informe, tipo_respuesta: 'abierta' }
    })
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  try {
    const informes = await informe.findAll({
      where: { id_practica: id_practica, id_informe: resx.id }
    })
    for (let informe of informes) {
      textos.push(informe.respuesta);
    }
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  const payload = { texto1: textos };
  await axios.post(process.env.PYTHONBE_REPEATED_SECTIONS, payload)
    .then((response: any) => {
      const repeticiones = { respuestas: response.data };
      try {
        const resp = practica.findAll({ where: { id: id_practica } });
        if (resp.length > 0) {
          practica.update({ key_repeticiones: repeticiones }, { where: { id: id_practica } })
            .then((resultados: any) => {
              return res.status(200).send({ message: "Repeticiones actualizadas", resultados: resultados });
            })
            .catch((err: any) => {
              res.send(500)
              console.log('Error al actualizar practica', err);
            })
        }
        else {
          console.log("No existe practica con id: ", req.query.id)
          res.sendStatus(404)
        }
      }
      catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
})

routerSimilitud.get('/detectar_plagio', jsonParser, async (req: any, res: any) => {
  const { id_practica } = req.query;
  if (!id_practica)
    return res.status(400).json({ message: "Debe proporcionar el id de una practica" });

  try {
    const Informes_estudiante = await informe.findAll({
      where: {
        id_practica: +id_practica,
        key: { [Op.ne]: null }
      },
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
    });
    if (!Informes_estudiante)
      return res.status(400).json({ message: "Práctica no existe" })
    if (Informes_estudiante.length == 0)
      return res.status(400).json({ message: "No se encontraron informes" })

    const Informes_base = await informe.findAll({
      where: {
        id_practica: { [Op.ne]: +id_practica },
        key: { [Op.ne]: null }
      },
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
    });

    if (!Informes_base || Informes_base.length == 0)
      return res.json({ plagio_detectado: false });

    let textos_base: Array<string> = [];
    let ids_base: Array<any> = []
    for (let inf of Informes_base) {
      const { pregunta_informes } = inf.config_informe;
      const { key } = inf;
      for (let pregunta of pregunta_informes) {
        textos_base.push(key[`${pregunta.id}`]);
        ids_base.push({ id_informe: inf.id, id_pregunta: pregunta.id });
      }
    }

    let textos_estudiante: Array<string> = [];
    let ids_estudiante: Array<any> = [];
    for (let inf of Informes_estudiante) {
      const { pregunta_informes } = inf.config_informe;
      const { key } = inf;
      for (let pregunta of pregunta_informes) {
        textos_estudiante.push(key[`${pregunta.id}`]);
        ids_estudiante.push({ id_informe: inf.id, id_pregunta: pregunta.id });
      }
    }

    const respuesta_py = await axios.post(`${process.env.URL_PYTHON_BACKEND}/nlp/calcular_similitud_textos`, {
      textos_base,
      textos: textos_estudiante
    });

    if (!respuesta_py || respuesta_py.status != 200 || !respuesta_py.data) {
      console.log(respuesta_py)
      return res.status(500).json({ message: "Se ha producido un error interno" })
    }

    let detecciones_plagios: Array<Object> = [];
    const similitudes = respuesta_py.data;
    for (let idx_similitudes_texto_estudiante = 0; idx_similitudes_texto_estudiante < similitudes.length; idx_similitudes_texto_estudiante++) {
      for (let idx_similitudes_textos_base = 0; idx_similitudes_textos_base < similitudes[idx_similitudes_texto_estudiante].length; idx_similitudes_textos_base++) {
        const val = similitudes[idx_similitudes_texto_estudiante][idx_similitudes_textos_base]
        if (val > 0.5) {
          detecciones_plagios.push({
            propio: ids_estudiante[idx_similitudes_texto_estudiante],
            similar_a: ids_base[idx_similitudes_textos_base]
          })
        }
      }
    }
    if (detecciones_plagios.length > 0)
      return res.json({
        plagio_detectado: true,
        plagios: detecciones_plagios
      });

    return res.json({
      plagio_detectado: false,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Se ha producido un error interno" })
  }




});

module.exports = routerSimilitud;