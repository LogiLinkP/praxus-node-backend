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
routerRespuesta_supervisor.post('/crear', jsonParser, async(req: any, res: any) => {
  const { id_pregunta_supervisor, id_practica, respuesta } = req.body;
  console.log("Request de respuesta_supervisor");
  try{
    await respuesta_supervisor.create({
      id_pregunta_supervisor: id_pregunta_supervisor,
      id_practica: id_practica,
      respuesta: respuesta
    })
    const _pregunta_supervisor = await pregunta_supervisor.findOne({ where: { id: id_pregunta_supervisor } })

    if(_pregunta_supervisor.tipo_respuesta == "abierta"){
      // buscar si hay informes en la practica asociada a esta respuesta, si los hay, enviar requests para calculo de consistencia
      const _informes = await informe.findAll({ where: { id_practica: id_practica } })

      if(_informes.length > 0){
        // concatenar informes en un solo string
        let texto_informes = "";
        for(let i = 0; i < _informes.length; i++){
          texto_informes += _informes[i].key + ". ";
        }
        texto_informes = texto_informes.slice(0, -1);

        // enviar informes y respuesta abierta del supervisor al python backend para calcular consistencia
        let consistencia_informe = await axios.post(process.env.PYTHONBE_CONSISTENCY, {
          texto1: texto_informes,
          texto2: respuesta
        });

        console.log(consistencia_informe.data);
        await practica.update({
            estado: "Evaluada",
            consistencia_informe: consistencia_informe.data.score,
            interpretacion_informe: consistencia_informe.data.interpretacion
        }, {
            where: {
                id_practica: id_practica
            }
        });
        res.status(200).json({ message: "Data recibida" });
      }
      
      

    }
  }
  catch(error) {
      console.log('Error al crear respuesta_supervisor', error);
      res.status(500).json({ message: "Error interno" });
  }
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