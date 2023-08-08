export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerConfigInforme = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerConfigInforme.get('', (req: any, res: any) => {
    console.log("Obteniendo config_informe con id: ", req.query.id)
    sequelize.config_informe.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener config_informe', err);
    })
})

//[GET] mostrar todos
routerConfigInforme.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos las config_informe")
    sequelize.config_informe.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar config_informe', err);
      res.send('Error al mostrar config_informe', err)
    })
})

//[DELETE] Eliminar
routerConfigInforme.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando config_informe con id: ", req.query.id)
  sequelize.config_informe.destroy({
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
    console.log('Error al eliminar de config_informe', err);
  })
})

//[POST] Crear uno
routerConfigInforme.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_config_practica, tipo_informe} = req.body;
  console.log("Request de config_informe");
  sequelize.config_informe.create({
    id_config_practica: id_config_practica,
    tipo_informe: tipo_informe,
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("config_informe creado");
  })
  .catch((err:any) => {
      console.log('Error al crear config_informe',err);
  })
})


//[PUT]
routerConfigInforme.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const config_informe = await sequelize.config_informe.findOne({ where: { id: req.body.id } })
    if (config_informe){
      config_informe.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar config_informe', err);
      })
    } else {
        console.log("No existe config_informe con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerConfigInforme;