export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerConfigInforme = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerConfigInforme.get('', (req: any, res: any) => {
    console.log("Obteniendo configuracion de informe con id: ", req.query.id)
    sequelize.informe.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener configuracion de informe', err);
    })
})

//[GET] mostrar todos
routerConfigInforme.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos las configuracion de informe")
    sequelize.informe.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar configuracion de informe', err);
      res.send('Error al mostrar configuracion de informe', err)
    })
})

//[DELETE] Eliminar
routerConfigInforme.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando configuracion de informe con id: ", req.query.id)
  sequelize.informe.destroy({
    where: {
      id: req.query.id
    }
  })
  .then((resultados:any) => {
    console.log(resultados);
    res.sendStatus(200);
  })
  .catch((err:any) => {
    res.send(500)
    console.log('Error al eliminar configuracion de informe', err);
  })
})

//[POST] Crear uno
routerConfigInforme.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_practica, tipo, hora, fecha} = req.body;
  console.log("Request de creacion de configuracion de informe");
  sequelize.informe.create({
    id_practica: id_practica,
    tipo: tipo,
    hora: hora,
    fecha: fecha
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("configuracion de informe creado");
  })
  .catch((err:any) => {
      console.log('Error al crear configuracion de informe',err);
  })
})


//[PUT]
routerConfigInforme.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const estuCursaPract = await sequelize.informe.findOne({ where: { id: req.body.id } })
    if (estuCursaPract){
      estuCursaPract.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar configuracion de informe', err);
      })
    } else {
        console.log("No existe configuracion de informe con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerConfigInforme;