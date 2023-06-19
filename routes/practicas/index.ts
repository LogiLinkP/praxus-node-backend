export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerPracticas = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] mostrar todas las practicas
routerPracticas.get('/todos', (req:any, res:any) => {
  console.log("Obteniendo todos los practica")
  sequelize.practica.findAll().then((resultados:any) => {
    res.send(resultados)
  })
  .catch((err:any) => {
    console.log('Error al mostrar practica', err);
    res.send('Error al mostrar practica', err)
  })
})

//[GET] para obtener una practica con su ID
routerPracticas.get('', (req: any, res: any) => {
    console.log("Obteniendo practica con id: ", req.query.id)
    sequelize.practica.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener practica', err);
        })
})

//[DELETE] Eliminar practica con su ID
routerPracticas.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando practica con id: ", req.query.id)
    sequelize.practica.destroy({
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
      console.log('Error al eliminar practica', err);
    })
  })

//[POST] Crear una practica con los datos recibidos
routerPracticas.post('/crear', jsonParser, (req: any, res: any) => {
    const {nombre, tipo_practica, num_informes, cantidad_horas, modalidad} = req.body;
    console.log("Request de creacion de practica recibida");
    sequelize.practica.create({
        nombre: nombre,
        tipo_practica: tipo_practica,
        num_informes: num_informes,
        cantidad_horas: cantidad_horas,
        modalidad: modalidad
    })
    .then((resultados:any) => {
        console.log(resultados);
        res.send("Practica creada");
    })
    .catch((err:any) => {
        console.log('Error al crear practica',err);
    })
})

module.exports = routerPracticas;