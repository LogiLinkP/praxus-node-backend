export { };

const { estudiante, usuario, practica, encargado, carrera, pregunta_supervisor, respuesta_supervisor } = require('../../models');
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
    const data = await estudiante.findOne({
      where: {
        id: req.query.id_estudiante
      },
      include: [{
        model: carrera, include:{ model: encargado, include: { model: usuario } } 
      }]
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerEstudiante.put('/linkedin', jsonParser, async (req: any, res: any) => {
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

routerEstudiante.put('/carrera', jsonParser, async (req: any, res: any) => {
  const Estudiante = await estudiante.findOne({ where: { id: req.body.id } })
  if (Estudiante) {
    // actualizar practica
    Estudiante.update({ id_carrera: req.body.id_carrera })
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

routerEstudiante.post('/get-comentarios', jsonParser, async (req: any, res: any) => {
  let {id_practica} = req.body;
  console.log(0)
  try{
    let _data = await practica.findOne({
      where: {
        id: id_practica
      },
      include: [{
        model : respuesta_supervisor, include: {model: pregunta_supervisor}
      }]
    })
    console.log(1)
    if(_data){
      console.log(2)
      return res.status(200).json({message: "Comentarios obtenidos", data: _data});
    }
    else{
      console.log(3)
      return res.status(500).json({message: "No se encontraron comentarios"});
    }
  }
  catch(error){
    console.log(4);
    res.status(500).json({ message: "Error interno" });
  }
})

module.exports = routerEstudiante;