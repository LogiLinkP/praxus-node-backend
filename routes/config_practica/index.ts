export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerConfigPracticas = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] mostrar todas las config_practicas
routerConfigPracticas.get('/todos', (req:any, res:any) => {
  console.log("Obteniendo todos los config_practica")
  sequelize.config_practica.findAll().then((resultados:any) => {
    res.send(resultados)
  })
  .catch((err:any) => {
    console.log('Error al mostrar config_practica', err);
    res.send('Error al mostrar config_practica', err)
  })
})

//[GET] para obtener una config_practica con su ID
routerConfigPracticas.get('', (req: any, res: any) => {
    console.log("Obteniendo config_practica con id: ", req.query.id)
    sequelize.config_practica.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener config_practica', err);
        })
})

//[DELETE] Eliminar config_practica con su ID
routerConfigPracticas.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando config_practica con id: ", req.query.id)
    sequelize.config_practica.destroy({
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
      console.log('Error al eliminar config_practica', err);
    })
  })

//[POST] Crear una config_practica con los datos recibidos
routerConfigPracticas.post('/crear', jsonParser, (req: any, res: any) => {
    const {nombre, tipo, num_informes, cantidad_horas, modalidad} = req.body;
    console.log("Request de creacion de config_practica recibida");
    sequelize.config_practica.create({
        nombre: nombre,
        tipo: tipo,
        num_informes: num_informes,
        cantidad_horas: cantidad_horas,
        modalidad: modalidad
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.send("config_practica creada");
    })
    .catch((err:any) => {
        console.log('Error al crear config_practica',err);
    })
})

//[PUT]
routerConfigPracticas.put('/actualizar', jsonParser, async (req:any, res:any) => {
  const config_practica = await sequelize.config_practica.findOne({ where: { id: req.body.id } })
  if (config_practica){
    config_practica.update(req.body)
    .then((resultados:any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err:any) => {
      res.send(500)
      console.log('Error al actualizar de config_practica', err);
    })
  } else {
      console.log("No existe config_practica con id: ", req.query.id)
      res.sendStatus(404)
  }
})

module.exports = routerConfigPracticas;