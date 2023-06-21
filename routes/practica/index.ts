export { };

const { practica, estudiante, config_practica } = require('../../models');
const { Router, json, urlencoded } = require('express');
const routerPractica = new Router(); // /practica
routerPractica.use(json());
routerPractica.use(urlencoded({ extended: true }));

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerPractica.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await practica.findOne({
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
      include: [estudiante, config_practica]
    });
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
        id_estudiante, id_config_practica: id_practica
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
    let { id_estudiante, id_config_practica, aprobacion } = req.body;
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
    });
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
  const { id_estudiante, id_config_practica, estado, nombre_supervisor, correo_supervisor,
    nombre_empresa, rut_empresa, fecha_inicio, fecha_termino, nota_evaluacion,
    consistencia_informe, consistencia_nota, key_informe_supervisor } = req.body;
  console.log("Request de creacion de practica recibida");
  practica.create({
    id_estudiante: id_estudiante,
    id_config_practica: id_config_practica,
    estado: estado,
    nombre_supervisor: nombre_supervisor,
    correo_supervisor: correo_supervisor,
    nombre_empresa: nombre_empresa,
    rut_empresa: rut_empresa,
    fecha_inicio: fecha_inicio,
    fecha_termino: fecha_termino,
    nota_evaluacion: nota_evaluacion,
    consistencia_informe: consistencia_informe,
    consistencia_nota: consistencia_nota,
    key_informe_supervisor: key_informe_supervisor
  })
    .then((resultados: any) => {
      res.status(200).json({mensaje:"ok"});
      console.log("practica creada");
    })
    .catch((err: any) => {
      res.status(500).json({mensaje:"error"});
      console.log('Error al crear practica');
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

//[GET] para obtener una practica de acuerdo al id del estudiante (por ahora se asume que tiene una práctica)
routerPractica.get('/get', (req: any, res: any) => {
  console.log("Obteniendo practica con id de estudiante: ", req.query.id_estudiante)
  practica.findOne({
      where: {
          id_estudiante: req.query.id_estudiante
      }
  })
      .then((resultados: any) => {
          res.send(resultados);
      })
      .catch((err: any) => {
          console.log('Error al obtener practica', err);
      })
})

module.exports = routerPractica;