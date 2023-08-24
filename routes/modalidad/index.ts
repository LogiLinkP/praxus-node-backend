export { };

const { modalidad, config_practica } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerModalidad = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerModalidad.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await modalidad.findOne({
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

//[GET] para obtener todos por id config_practica
routerModalidad.get('/id_config_practica', async (req: any, res: any) => {
    try {
      if (!("id" in req.query)) {
        res.status(406).json({ message: "Se requiere ingresar id" });
        return;
      }
      const data = await modalidad.findAll({
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
  

//[GET] mostrar todos
routerModalidad.get('/todos', async (req: any, res: any) => {
  try {
    const data = await modalidad.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerModalidad.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando modalidad con id: ", req.query.id)
 modalidad.destroy({
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
      console.log('Error al eliminar modalidad', err);
    })
})

//[POST] Crear un modalidad con los datos recibidos
routerModalidad.post('/crear', jsonParser, (req: any, res: any) => {
    const { id_config_practica, tipo_modalidad, cantidad_tiempo} = req.body;
    console.log("Request de creacion de modalidad recibida");
    modalidad.create({
      id_config_practica: id_config_practica,
      tipo_modalidad: tipo_modalidad,
      cantidad_tiempo: cantidad_tiempo
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.status(200).json({ message: "modalidad creada" });
    })
    .catch((err:any) => {
        console.log('Error al crear modalidad', err);
        res.status(500).json({ message: "Error al crear modalidad", error: err});
    })
  })

//[PUT]
routerModalidad.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Mensaje = await modalidad.findOne({ where: { id: req.body.id } })
  if (Mensaje) {
    // actualizar practica
    Mensaje.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar modalidad', err);
      })
  } else {
    console.log("No existe modalidad con id: ", req.query.id)
    res.sendStatus(404)
  }
})

module.exports = routerModalidad;