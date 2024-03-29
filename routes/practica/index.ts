export { };

const { practica, estudiante, config_practica, usuario, empresa, supervisor, informe, documento, solicitud_documento,
  documento_extra, respuesta_supervisor, pregunta_supervisor, config_informe, encargado, modalidad, pregunta_informe } = require('../../models');
const { Router, json, urlencoded } = require('express');

const {encrypt} = require('../../utils/encriptar');
const crypto = require('crypto');
const routerPractica = new Router(); // /practica
const axios = require('axios');
const { gen_resumen } = require("../../middleware/resumen_utils");
const { detectar_plagio } = require("../../utils/plagio");

routerPractica.use(json());
routerPractica.use(urlencoded({ extended: true }));

import { sendMail } from '../../utils/email';

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
      include: [{ model: estudiante, include: [usuario] }, { model: modalidad, include: { model: config_practica, include: { model: solicitud_documento } } },
        empresa, supervisor, { model: informe, include: [config_informe] }, { model: documento, include: [solicitud_documento] }, documento_extra,
      { model: respuesta_supervisor, include: [pregunta_supervisor] }]
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
      include: [{ model: estudiante, include: [usuario] }, { model: modalidad, include: [{ model: config_practica, include: [pregunta_supervisor] }] }]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener todas las practica con config_practica
routerPractica.get('/configs', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await practica.findAll({
      where: {
        id_config_practica: req.query.id
      }
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
    console.log("token: ", req.query.token);
    console.log("iv: ", req.query.iv);
    //decrypt the encripted id in req.query.id with the algorith and key in the .env file
    const decrypt = (hash: any) => {
      const algorithm = process.env.ENCRYPT_ALGORITHM;
      const key = process.env.ENCRYPT_SECRET_KEY;
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'))
      const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
      return decrypted.toString()
    }

    let decrypted_id = decrypt({ content: req.query.token, iv: req.query.iv });

    console.log("decrypted_id!!!!!", decrypted_id);

    const data = await practica.findOne({
      where: {
        id: decrypted_id
      },
      include: [{ model: estudiante, include: [usuario] }, {
            model: modalidad, include: [{ model: config_practica, include: [pregunta_supervisor] }]},
            empresa, supervisor
          ]
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
    include: [{ model: estudiante, include: [usuario] }, {
      model: modalidad, include: { model: config_practica, include: [{ model: solicitud_documento }, { model: config_informe, include: [pregunta_informe] }] }
    }, empresa,
      supervisor, { model: informe, include: { model: config_informe, include: [pregunta_informe] } }, { model: documento, include: [solicitud_documento] },
      documento_extra, { model: respuesta_supervisor, include: [pregunta_supervisor] }, { model: encargado, include: [usuario] }]
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
    include: [{ model: estudiante, include: [usuario] }, config_practica, empresa, supervisor, { model: informe, include: [config_informe] },
    { model: documento, include: [solicitud_documento] }, documento_extra, { model: respuesta_supervisor, include: [pregunta_supervisor] }, encargado]
  })
    .then((resultados: any) => {
      res.send(resultados);
    })
    .catch((err: any) => {
      console.log('Error al obtener practica', err);
    })
})

//[GET] para obtener todas las practicas de una empresa
routerPractica.get('/empresa', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await practica.findAll({
      where: {
        id_empresa: req.query.id
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

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

      include: [{ model: estudiante, include: [usuario] }, { model: modalidad, include: [config_practica] }],

    });
    console.log("Carrera: ", req);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerPractica.put("/finalizar", async (req: any, res: any) => {
  try {
    let { id_estudiante, id_practica, estado } = req.body;
    if (typeof id_estudiante === "undefined" || typeof id_practica === "undefined" || typeof estado === "undefined") {
      res.status(406).json({ message: "Se requiere ingresar id_estudiante, id_practica y estado" });
      return;
    }
    switch (estado) {
      case "Revisión solicitada": break;
      case "Finalizada": break;
      case "Observaciones": break;
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


    // Envio de correo al supervisor

    if ("correo" in req.body && "nom_estudiante" in req.body) {
      const { correo, nom_estudiante } = req.body;     

      let encrypted_str = encrypt(req.body.id_practica.toString());

      // send the email with the encrypted id_practica
      sendMail(correo, `Revisión de práctica de ${nom_estudiante}`, "Para evaluar al practicante debe acceder a " + process.env.URL_FRONTEND + "/supervisor/evaluacion?token=" + encrypted_str.content + "&iv=" + encrypted_str.iv, "Revisión de práctica de " + nom_estudiante);
      //console.log("correo enviado correctamente");

      const res_plagio = await detectar_plagio(+id_practica);

      res.status(200).json({ message: "Correo enviado y estado actualizado" });
    } else {
      res.status(406).json({ message: "Se requiere ingresar correo, el nombre del supervisor y nombre del estudiante" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerPractica.put("/aprobar", async (req: any, res: any) => {
  try {
    let { id_estudiante, id_modalidad, aprobacion } = req.body;
    if (typeof id_estudiante === "undefined" || typeof id_modalidad === "undefined" || typeof aprobacion === "undefined") {
      res.status(406).json({ message: "Se requiere ingresar id_estudiante, id_modalidad y aprobacion" });
      return;
    }
    const data = await practica.update({
      estado: aprobacion == 1 ? "Aprobada" : "Reprobada"
    }, {
      where: {
        id_estudiante,
        id_modalidad
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
routerPractica.post('/crear', jsonParser, async (req: any, res: any) => {
  try{
    const { id_estudiante, id_config_practica, id_supervisor, id_empresa, id_encargado, id_modalidad, estado,
      fecha_inicio, fecha_termino, nota_evaluacion,
      consistencia_informe, consistencia_nota, resumen, indice_repeticion, key_repeticiones, key_fragmentos
      , calificacion_empresa, comentario_empresa } = req.body;
    console.log("Request de creacion de practica recibida");
    const _pratica = await practica.create({
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
      key_fragmentos: key_fragmentos,
      calificacion_empresa: calificacion_empresa,
      comentario_empresa: comentario_empresa,
      ev_encargado: -1,
    })

    // Chequear obtener la modalidad asociada a la practica, luego la config practica asociada a la modalidad
    // y luego chequear si el campo informe_final en ella dice "si". De ser así, se debe crear un informe final,
    // para lo cual se debe buscar todas las config_informe asociadas a esta config_practica y encontrar el id de
    // la que tenga el campo tipo_informe (llevado a minúsculas) con valor "informe final".

    // Crear informe final
    const _modalidad = await modalidad.findOne({ where: { id: id_modalidad } });
    const _config_practica = await config_practica.findOne({ where: { id: _modalidad.id_config_practica } });
    const _config_informes = await config_informe.findAll({ where: { id_config_practica: _config_practica.id } });

    if ( _config_informes.length > 0 ) {
      const _config_informe = _config_informes.find( (config_informe: any) => config_informe.tipo_informe.toLowerCase() === "informe final" );
      if ( _config_informe ) {
        await informe.create({
          id_practica: _pratica.id,
          id_config_informe: _config_informe.id,
          horas_trabajadas: 0,
          fecha: new Date()
        })
      }
    }

    res.status(200).json({message: "Practica creada"});
  } catch (error:any) {
    console.log('Error al crear practica', error);
    res.status(500).json({ message: "Error al crear practica"});
  }
})

//[POST] Crear uno mandando correo a supervisor para confirmar
routerPractica.post('/crear_verifica_supervisor', jsonParser, async (req: any, res: any) => {
  try{
    const { id_estudiante, id_config_practica, id_supervisor, id_empresa, id_encargado, id_modalidad, estado,
      fecha_inicio, fecha_termino, nota_evaluacion,
      consistencia_informe, consistencia_nota, resumen, indice_repeticion, key_repeticiones, key_fragmentos
      , calificacion_empresa, comentario_empresa } = req.body;
    console.log("Request de creacion de practica recibida");
    const _practica = await practica.create({
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
      key_fragmentos: key_fragmentos,
      calificacion_empresa: calificacion_empresa,
      comentario_empresa: comentario_empresa,
      ev_encargado: -1
    })
    if(_practica){

      // buscar la config practica asociada a la modalidad, y ver si tiene informe final. si lo tiene, se debe crear un informe final
      const _modalidad = await modalidad.findOne({ where: { id: id_modalidad }, include: [{model: config_practica, include:[{model:config_informe, where:{tipo_informe:"informe final"}}]}] });

      if (!_modalidad || !_modalidad.config_practica) {
        return res.status(404).json({ mensaje: "Error: No se ha encontrado la modalidad, configuración de práctica o configuración de informe asociada a la práctica, inténtelo nuevamente" });
      }

      if ( _modalidad.config_practica.informe_final == "si") {
        // crear informe final (se asume que solo habrá un config informe con tipo_informe = "informe final")
        const _informe = await informe.create({
          id_practica: _practica.id,
          id_config_informe: _modalidad.config_practica.config_informes[0].id,
          horas_trabajadas: 0,
          fecha: new Date()
        });
        

        if (!_informe) {
          return res.status(404).json({ mensaje: "Error: No se ha podido crear el informe final, inténtelo nuevamente" });
        }
      }       

      let encrypted_str = encrypt(_practica.id.toString());

      const _supervisor = await supervisor.findOne({ where: { id: id_supervisor } });

      if (!_supervisor || _supervisor.correo == "" || !_supervisor.correo) {
        return res.status(404).json({ mensaje: "Error: El correo del supervisor no ha podido registrarse, inténtelo nuevamente" });
      }

      const _estudiante = await estudiante.findOne({ where: { id: id_estudiante }, include: [usuario] });

      if (!_estudiante || !_estudiante.usuario || _estudiante.usuario.nombre == "" || !_estudiante.usuario.nombre) {
        return res.status(404).json({ mensaje: "Error: Usuario del estudiante no encontrado, inténtelo nuevamente" });
      }

      sendMail(_supervisor.correo, `Confirmar práctica de ${_estudiante.usuario.nombre}`, 
              `El estudiante ${_estudiante.usuario.nombre} desea su confirmación para iniciar su práctica. Por favor, ingrese al siguiente sitio para verificar los datos asociados:\n\n` 
              + process.env.URL_FRONTEND + "/confirmar-inicio-practica?token=" + encrypted_str.content + "&iv=" + encrypted_str.iv,
              "Confirmar práctica de " + _estudiante.usuario.nombre);

      return res.status(200).json({ mensaje: "Práctica creada correctamente." });
    }
    else{
      return res.status(500).json({ mensaje: "1 - error en la creación de la práctica" });
      
    }
  } catch(err){
    console.log(err);
    res.status(500).json({ mensaje: "2 - error en la creación de la práctica" });
  }
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
        res.status(200).json({ message: "practica actualizada" });
      })
      .catch((err: any) => {
        res.status(500).json({ message: "Error al actualizar practica", error: err });
        console.log('Error al actualizar practica', err);
      })
  } else {
    console.log("No existe practica con id: ", req.query.id)
    res.status(404).json({ message: "No existe practica con el id ingresado" });
  }
})

routerPractica.put('/eval_encargado', jsonParser, async (req: any, res: any) => {
  try {
    let { id_practica, ev_encargado } = req.body;
    if (!id_practica || !ev_encargado) {
      return res.status(400).json({ message: "Debe ingresar id_practica y evaluacion" });
    }
    console.log("1")
    const data = await practica.findOne(
      {
        where: {
          id: id_practica
        }
      }
    )
    console.log("2")
    if (!data) {
      return res.status(400).json({ message: "No se pudo encontrar la practica" });
    }
    console.log(data)
    await data.update({
      ev_encargado: ev_encargado
    })
    console.log(data);
    res.status(200).json({ message: "Estado actualizado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerPractica.post("/resumen", jsonParser, async (req: any, res: any) => {
  const { id_practica } = req.query;
  if (!id_practica) {
    return res.status(406).json({ message: "Se requiere ingresar id_practica" });
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
          required: false,
          include: [
            {
              model: pregunta_supervisor,
              required: false,
              where: { tipo_respuesta: 'abierta' }
            }
          ]
        }
      ]
    });
    if (!Practica) {
      return res.status(404).json({ message: "No existe practica con id: " + id_practica });
    }
    if (Practica.resumen && Object.keys(Practica.resumen).length > 0) {
      return res.status(200).json(Practica.resumen);
    }
    const Informe = Practica.informes;
    let texto_informe = "";
    for (let inf of Informe) {
      let key = inf.key;
      if (!key) continue;
      for (let pregunta of inf.config_informe.pregunta_informes) {
        texto_informe += "#Enunciado: " + pregunta.enunciado + "\n";
        texto_informe += "#Respuesta: " + (key[pregunta.id] || "") + "\n\n";
      }
    }
    texto_informe = texto_informe.trim();
    const inf_valido = texto_informe.split(" ").length > 50;

    const RespuestaSupervisor = Practica.respuesta_supervisors;
    let texto_supervisor = "";
    for (let resp of RespuestaSupervisor) {
      if (!resp.pregunta_supervisor) continue;
      texto_supervisor += "#Enunciado: " + resp.pregunta_supervisor.enunciado + "\n";
      texto_supervisor += "#Respuesta: " + (resp.respuesta || "") + "\n\n";
    }
    texto_supervisor = texto_supervisor.trim();
    const sup_valido = texto_supervisor.split(" ").length > 50;

    let resumen: any = {};
    resumen.informe = inf_valido ? await gen_resumen(texto_informe) : texto_informe;
    resumen.supervisor = sup_valido ? await gen_resumen(texto_supervisor) : texto_supervisor;

    await Practica.update({ resumen });

    return res.status(200).json(resumen);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno" });
  }
});

module.exports = routerPractica;