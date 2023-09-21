export { };

const { estudiante, usuario, practica, encargado } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerEstudiante = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un estudiante con su ID
routerEstudiante.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await estudiante.findOne({
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

//[GET] para obtener un estudiante con su ID de usuario
routerEstudiante.get('/usuario', async (req: any, res: any) => {
  try {
    if (!("id_usuario" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id_usuario" });
      return;
    }
    const data = await estudiante.findOne({
      where: {
        id_usuario: req.query.id_usuario
      },
      include: [{
        model: usuario
      }]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] mostrar todos los estudiantes
routerEstudiante.get('/todos', async (req: any, res: any) => {
  try {
    const data = await estudiante.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});


//[DELETE] Eliminar estudiante con su ID
routerEstudiante.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando estudiante con id: ", req.query.id)
  estudiante.destroy({
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
      console.log('Error al eliminar estudiante', err);
    })
})

//[POST] Crear un estudiante con los datos recibidos
routerEstudiante.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_usuario, nombre_id_org, id_org, rut, perfil_linkedin, empresa_destacada, id_carrera } = req.body;
  console.log("Request de creacion de estudiante recibida");
  estudiante.create({
    id_usuario: id_usuario,
    nombre_id_org: nombre_id_org,
    id_org: id_org,
    rut: rut,
    perfil_linkedin: perfil_linkedin,
    empresa_destacada: empresa_destacada,
    id_carrera: id_carrera
  })
    .then((resultados: any) => {
      res.send("Estudiante creado");
    })
    .catch((err: any) => {
      console.log('Error al crear estudiante', err);
    })
})

//[PUT]
routerEstudiante.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Estudiante = await estudiante.findOne({ where: { id: req.body.id } })
  if (Estudiante) {
    // actualizar practica
    Estudiante.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar estudiante', err);
      })
  } else {
    console.log("No existe estudiante con id: ", req.body.id)
    res.sendStatus(404)
  }
})

//[PUT] actualizar configuracion de estudiantes
routerEstudiante.put('/actualizarConfig', jsonParser, async (req: any, res: any) => {
    // buscar practica por id
    const Estudiante = await estudiante.findOne({ where: { id: req.body.id } })
    if (Estudiante) {
      // actualizar practica
      Estudiante.update(req.body)
        .then((resultados: any) => {
          console.log(resultados);
          res.status(200).json(resultados);
        })
        .catch((err: any) => {
          res.send(500).json(err)
          console.log('Error al actualizar estudiante', err);
        })
    } else {
      console.log("No existe estudiante con id: ", req.body.id)
      res.sendStatus(404)
    }
})

//[GET] obtener todos los encargado dado un estudiante
routerEstudiante.get('/encargados', async (req: any, res: any) => {
  try {
    console.log(req.query)
    if (!("id_estudiante" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id_estudiante" });
      return;
    }
    console.log(1)
    const data = await estudiante.findAll({
      where: {
        id: req.query.id_estudiante
      },
      include: [{
        model: practica, include: [{ model: encargado, include: [{ model: usuario }] }]
      }]
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerEstudiante.put('/linkedin', jsonParser, async (req: any, res: any) => {
  console.log("HOLAAAAAAAAAAAAAAAAAAAAAa")
  console.log(req)
  const Estudiante = await estudiante.findOne({ where: { id: req.body.id } })
  if (Estudiante) {
    // actualizar practica
    Estudiante.update({ perfil_linkedin: req.body.link })
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar estudiante', err);
      })
  } else {
    console.log("No existe estudiante con id: ", req.body.id)
    res.sendStatus(404)
  }
})

module.exports = routerEstudiante;