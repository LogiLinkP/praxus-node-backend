export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerSupervisor = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un supervisor con su ID
routerSupervisor.get('', (req: any, res: any) => {
    console.log("Obteniendo supervisor de id: ", req.query.id)
    sequelize.supervisor.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener supervisor', err);
        })
})

//[GET] mostrar todos los supervisors
routerSupervisor.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los supervisors")
    sequelize.supervisor.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar supervisors', err);
      res.send('Error al mostrar supervisors', err)
    })
})

//[DELETE] Eliminar supervisor con su ID
routerSupervisor.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando supervisor con id: ", req.query.id)
    sequelize.supervisor.destroy({
        where: {
          id: req.query.id
        }
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
    })
    .catch((err:any) => {
        res.send(500);
        console.log('Error al eliminar supervisor', err);
    })
})

//[POST] Crear un supervisor con los datos recibidos
routerSupervisor.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_usuario, nombre, correo, carnet_rostro, es_correo_institucional} = req.body;
  console.log("Request de creacion de supervisor recibida");
  sequelize.supervisor.create({
      id_usuario: id_usuario,
      nombre: nombre,
      correo: correo,
      carnet_rostro: carnet_rostro,
      es_correo_institucional: es_correo_institucional
  })
  .then((resultados:any) => {
      res.send("supervisor creado");
  })
  .catch((err:any) => {
      console.log('Error al crear supervisor',err);
  })
})

//[PUT]
routerSupervisor.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const supervisor = await sequelize.supervisor.findOne({ where: { id: req.body.id } })
    if (supervisor){
      supervisor.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de supervisor', err);
      })
    } else {
        console.log("No existe supervisor con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerSupervisor;