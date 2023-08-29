import { text } from "stream/consumers";

export { };

const { respuesta_supervisor, pregunta_supervisor, practica, informe } = require('../../models');
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
routerRespuesta_supervisor.post('/responder_encuesta', jsonParser, async(req: any, res: any) => {
  // se asume que los ids de preguntas y las respuestas vienen en el mismo orden, es decir, respuesta[i] está relacionado a pregunta[i]
  const { ids_preguntas_supervisor, id_practica, respuestas } = req.body;

  console.log("Ids_preguntas_supervisor:", ids_preguntas_supervisor);
  console.log("Id_practica:", id_practica);
  console.log("Request de respuesta_supervisor - las respuestas son:", respuestas);

  const _informes = await informe.findAll({ where: { id_practica: id_practica } })

  let texto_informes = "";
  let texto_respuestas = "";

  if(_informes.length > 0){
    // concatenar informes en un solo string POR AHORA SE ASUME QUE TODOS LOS INFORMES TIENEN UNA RESPUESTA CON TEXTO LEGIBLE EN EL CAMPO KEY 
    // (después pueden haber otras cosas dependiendo del tipo de pregunta, y puede haber más de un elemento) 
    for(let i = 0; i < _informes.length; i++){
      console.log("INFORME: ", _informes[i].key);
      let respuestas_informe = _informes[i].key
      let first_key = Object.keys(respuestas_informe)[0]; // SOLO SE TOMA LA PRIMERA KEY DEL INFORME

      if(respuestas_informe[first_key] != ""){
        texto_informes += respuestas_informe[first_key] + ". ";
      }

    }
    texto_informes = texto_informes.slice(0, -1);
  }

  for(let i = 0; i < ids_preguntas_supervisor.length; i++){
    try{
      await respuesta_supervisor.create({
        id_pregunta_supervisor: ids_preguntas_supervisor[i],
        id_practica: id_practica,
        respuesta: respuestas[i]
      })

      const _pregunta_supervisor = await pregunta_supervisor.findOne({ where: { id: ids_preguntas_supervisor[i] } })

      if(_pregunta_supervisor.tipo_respuesta == "abierta"){     
        texto_respuestas += respuestas[i] + ". ";
      }
    }
    catch(error) {
        console.log('Error al crear respuesta_supervisor', error);
        res.status(500).json({ message: "Error interno" });
    }
  }

  console.log("INFORMES:")
  console.log(texto_informes);
  console.log("RESPUESTAS:")
  console.log(texto_respuestas);

  // ENVIAR INFORMES Y RESPUESTAS PARA CALCULO DE CONSISTENCIA:

  
  let consistencia_informe = await axios.post(process.env.PYTHONBE_CONSISTENCY, {
    texto1: texto_informes,
    texto2: texto_respuestas
  });

  console.log("CONSISTENCIA INFORME: ", consistencia_informe.data);

  console.log(consistencia_informe.data);
  await practica.update({
      estado: "Evaluada",
      consistencia_informe: consistencia_informe.data.score,
      interpretacion_informe: consistencia_informe.data.interpretacion
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

