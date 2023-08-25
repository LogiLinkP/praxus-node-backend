export { };

const { practica, estudiante, config_practica, usuario, empresa, supervisor, informe, documento, solicitud_documento,
        documento_extra, respuesta_supervisor, pregunta_supervisor, config_informe, encargado, modalidad } = require('../../models');
const { Router, json, urlencoded } = require('express');
const crypto = require('crypto');
const routerPractica = new Router(); // /practica
routerPractica.use(json());
routerPractica.use(urlencoded({ extended: true }));

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener una practica CON TODAS LAS TABLAS ASOCIADAS
routerPractica.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await practica.findOne({
      where: {
        id: req.query.id
      },
      include: [{model: estudiante, include: [usuario]},  {model: modalidad, include: [config_practica]}, empresa, supervisor, 
                {model: informe, include: [config_informe]}, {model: documento, include: [solicitud_documento]}, documento_extra, 
                {model:respuesta_supervisor, include: [pregunta_supervisor]}]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener una practica con con su config_practica y las preguntas_supervisor asociadas
routerPractica.get('/preguntas_supervisor', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await practica.findOne({
      where: {
        id: req.query.id
      },
      include: [{model: estudiante, include: [usuario]}, {model: modalidad, include: [{model:config_practica, include: [pregunta_supervisor]}]}]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener una practica con el id encriptado (debe venir un token y un iv)
routerPractica.get('/encrypted', async (req: any, res: any) => {
  try { 
    if (!("token" in req.query) || !("iv" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar token e iv" });
      return;
    }

    //decrypt the encripted id in req.query.id with the algorith and key in the .env file
    const decrypt = (hash:any) => {
      const algorithm = process.env.ENCRYPT_ALGORITHM;
      const key = process.env.ENCRYPT_SECRET_KEY;
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'))    
      const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])    
      return decrypted.toString()
    }

    let decrypted_id = decrypt({content: req.query.token, iv: req.query.iv});

    console.log("decrypted_id!!!!!", decrypted_id);

    const data = await practica.findOne({
      where: {
        id: decrypted_id
      },
      include: [{model: estudiante, include: [usuario]}, {model: modalidad, include: [
                {model:config_practica, include: [pregunta_supervisor]}]}]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener todas las practicas con el id de un estudiante
routerPractica.get('/get_asEstudiante', (req: any, res: any) => {
  console.log("Obteniendo practica con id de estudiante: ", req.query.id_estudiante)
  practica.findAll({
    where: {
      id_estudiante: req.query.id_estudiante
    },
    include: [{model: estudiante, include: [usuario]}, {model: modalidad, include: {model: config_practica, 
              include: [{model: solicitud_documento, include:[documento]}, config_informe]}}, empresa, 
              supervisor, {model: informe, include: [config_informe]}, {model: documento, include: [solicitud_documento]}, 
              documento_extra, {model:respuesta_supervisor, include: [pregunta_supervisor]}, {model:encargado, include: [usuario]}]
  })
    .then((resultados: any) => {
      res.send(resultados);
    })
    .catch((err: any) => {
      console.log('Error al obtener practica', err);
    })
})

//[GET] para obtener todas las practicas con el id de un encargado
routerPractica.get('/get_asEncargado', (req: any, res: any) => {
  console.log("Obteniendo practica con id de estudiante: ", req.query.id_encargado)
  practica.findAll({
    where: {
      id_estudiante: req.query.id_encargado
    },
    include: [{model: estudiante, include: [usuario]}, config_practica, empresa, supervisor, {model: informe, include: [config_informe]}, 
              {model: documento, include: [solicitud_documento]}, documento_extra, {model:respuesta_supervisor, include: [pregunta_supervisor]}, encargado]
  })
    .then((resultados: any) => {
      res.send(resultados);
    })
    .catch((err: any) => {
      console.log('Error al obtener practica', err);
    })
})

//[GET] mostrar todos
routerPractica.get('/todos', async (req: any, res: any) => {
  try {
    const data = await practica.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerPractica.get("/estudiantes_practicas", async (req: any, res: any) => {
  try {
    const data = await practica.findAll({
      include: [{model: estudiante, include: [usuario]}, {model: modalidad, include: [config_practica]}]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerPractica.put("/finalizar", async (req: any, res: any) => {
  try {
    let { id_estudiante, id_practica, estado} = req.body;
    if (typeof id_estudiante === "undefined" || typeof id_practica === "undefined" || typeof estado === "undefined") {
      res.status(406).json({ message: "Se requiere ingresar id_estudiante, id_practica y estado" });
      return;
    }
    switch (estado) {
      case "Revisión solicitada":
      case "Finalizada":
      case "Observaciones":
        break;
      default:
        res.status(406).json({ message: "Estado inválido" });
        return;
    }
    const data = await practica.update({
      estado
    }, {
      where: {
        id_estudiante, id: id_practica
      }
    });

    console.log(data);
    res.status(200).json({ message: "Estado actualizado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerPractica.put("/aprobar", async (req: any, res: any) => {
  try {  
    let { id_estudiante, id_config_practica, aprobacion} = req.body;
    if (typeof id_estudiante === "undefined" || typeof id_config_practica === "undefined" || typeof aprobacion === "undefined") {
      res.status(406).json({ message: "Se requiere ingresar id_estudiante, id_config_practica y aprobacion" });
      return;
    }
    const data = await practica.update({
      estado: aprobacion == 1 ? "Aprobada" : "Reprobada"
    }, {
      where: {
        id_estudiante, id_config_practica
      }
    }).then((resultados: any) => {   
      console.log(resultados);
      res.status(200).json({ message: "Estado actualizado" });
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerPractica.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando practica con id: ", req.query.id)
  practica.destroy({
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
      console.log('Error al eliminar practica', err);
    })
})

//[POST] Crear uno
routerPractica.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_estudiante, id_config_practica, id_supervisor, id_empresa, id_encargado, id_modalidad, estado,
    fecha_inicio, fecha_termino, nota_evaluacion,
    consistencia_informe, consistencia_nota, resumen, indice_repeticion, key_repeticiones, key_fragmentos} = req.body;
  console.log("Request de creacion de practica recibida");
  practica.create({
    id_estudiante: id_estudiante,
    id_config_practica: id_config_practica,
    id_supervisor: id_supervisor,
    id_empresa: id_empresa,
    id_encargado: id_encargado,
    id_modalidad: id_modalidad,
    estado: estado,
    fecha_inicio: fecha_inicio,
    fecha_termino: fecha_termino,
    nota_eval: nota_evaluacion,
    consistencia_informe: consistencia_informe,
    consistencia_nota: consistencia_nota,
    resumen: resumen,
    indice_repeticion: indice_repeticion,
    key_repeticiones: key_repeticiones,
    key_fragmentos: key_fragmentos
  })
    .then((resultados: any) => {
      res.status(200).json({ mensaje: "ok" });
      console.log("practica creada");
    
    })
    .catch((err: any) => {
      res.status(500).json({ mensaje: "error" });
      console.log('Error al crear practica', err.message, fecha_inicio);
    })
})


//[PUT]
routerPractica.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Practica = await practica.findOne({ where: { id: req.body.id } })
  if (Practica) {
    // actualizar practica
    Practica.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar practica', err);
      })
  } else {
    console.log("No existe practica con id: ", req.query.id)
    res.sendStatus(404)
  }
})



module.exports = routerPractica;