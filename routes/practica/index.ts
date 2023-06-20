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
      res.sendStatus(200)
      console.log("practica creada");
    })
    .catch((err: any) => {
      res.sendStatus(500)
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

module.exports = routerPractica;