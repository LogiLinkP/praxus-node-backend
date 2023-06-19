//EX "RESPUESTA INFORME"
//AHORA "INFORME" SOLAMENTE
//CAMBIAR EN BDD

export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerInforme = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerInforme.get('', (req: any, res: any) => {
    console.log("Obteniendo informe con id: ", req.query.id)
    sequelize.respuesta_informe.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener informe', err);
    })
})

//[GET] mostrar todos
routerInforme.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los informe")
    sequelize.respuesta_informe.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar informe', err);
      res.send('Error al mostrar informe', err)
    })
})

//[DELETE] Eliminar
routerInforme.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando informe con id: ", req.query.id)
  sequelize.respuesta_informe.destroy({
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
    console.log('Error al eliminar de informe', err);
  })
})

//[POST] Crear uno
routerInforme.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_practica, tipo, hora, fecha} = req.body;
  console.log("Request de creacion de informe");
  sequelize.respuesta_informe.create({
    id_practica: id_practica,
    tipo: tipo,
    hora: hora,
    fecha: fecha
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("informe creado");
  })
  .catch((err:any) => {
      console.log('Error al crear informe',err);
  })
})


//[PUT]
routerInforme.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const estuCursaPract = await sequelize.respuesta_informe.findOne({ where: { id: req.body.id } })
    if (estuCursaPract){
      estuCursaPract.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de informe', err);
      })
    } else {
        console.log("No existe informe con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerInforme;