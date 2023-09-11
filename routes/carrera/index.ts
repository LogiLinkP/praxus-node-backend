export { };

const { carrera } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerCarrera = new Router(); // /carrera

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerCarrera.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await carrera.findOne({
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
routerCarrera.get('/todos', async (req: any, res: any) => {
  try {
    const data = await carrera.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerCarrera.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando carrera con id: ", req.query.id)
  carrera.destroy({
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
      console.log('Error al eliminar carrera', err);
    })
})
//[POST] Crear uno
routerCarrera.post('/crear', jsonParser, (req: any, res: any) => {
  const { nombre, ramos, correos_admitidos, estadistica_ramos } = req.body;
  console.log("Request de carrera");
  carrera.create({
    nombre: nombre,
    ramos: ramos,
    correos_admitidos: correos_admitidos,
    estadistica_ramos: estadistica_ramos
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.send("carrera creada");
    })
    .catch((err: any) => {
      console.log('Error al crear carrera', err);
    })
})


//[PUT]
routerCarrera.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Encargado = await carrera.findOne({ where: { id: req.body.id } })
  if (Encargado) {
    // actualizar practica
    Encargado.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar carrera', err);
      })
  } else {
    console.log("No existe carrera con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerCarrera;