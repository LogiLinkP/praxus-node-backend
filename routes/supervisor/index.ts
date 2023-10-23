export { };

const { supervisor } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerSupervisor = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerSupervisor.get('', async (req: any, res: any) => {
    try {
      if (!("id" in req.query)) {
        res.status(406).json({ message: "Se requiere ingresar id" });
        return;
      }
      const data = await supervisor.findOne({
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

//[GET] mostrar todos los supervisores
routerSupervisor.get('/todos', async (req: any, res: any) => {
    try {
      const data = await supervisor.findAll();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error interno" });
    }
  });

//[DELETE] Eliminar supervisor con su ID
routerSupervisor.delete('/eliminar', (req: any, res: any) => {
    console.log("Eliminando supervisor con id: ", req.query.id)
    supervisor.destroy({
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
        console.log('Error al eliminar empresa', err);
      })
  })

//[POST] Crear un supervisor con los datos recibidos
routerSupervisor.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_usuario, nombre, correo, carnet_rostro} = req.body;
  const correos_ilegales = ["gmail", "yahoo", "yop", "outlook", "hotmail"]
  let es_correo_institucional = true;

  console.log("Request de creacion de supervisor recibida");
  
  if (correos_ilegales.includes(correo.split("@")[1].split(".")[0])) {
    es_correo_institucional = false;
  }
  
  supervisor.create({
      id_usuario: id_usuario,
      nombre: nombre,
      correo: correo,
      carnet_rostro: carnet_rostro,
      es_correo_institucional: es_correo_institucional
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.status(200).json({id: resultados.dataValues.id});
  })
  .catch((err:any) => {
      console.log('Error al crear supervisor',err);
  })
})

//[PUT]
routerSupervisor.put('/actualizar', jsonParser, async (req: any, res: any) => {
    // buscar practica por id
    const Supervisor = await supervisor.findOne({ where: { id: req.body.id } })
    if (Supervisor) {
      // actualizar practica
      Supervisor.update(req.body)
        .then((resultados: any) => {
          console.log(resultados);
          res.sendStatus(200);
        })
        .catch((err: any) => {
          res.send(500)
          console.log('Error al actualizar supervisor', err);
        })
    } else {
      console.log("No existe supervisor con id: ", req.query.id)
      res.sendStatus(404)
    }
  })  

module.exports = routerSupervisor;