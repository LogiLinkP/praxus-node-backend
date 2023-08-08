export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerDocuemntoExtra = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un documento_extra con su ID
routerDocuemntoExtra.get('', (req: any, res: any) => {
    console.log("Obteniendo documento_extra de id: ", req.query.id)
    sequelize.documento_extra.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener documento_extra', err);
        })
})

//[GET] mostrar todos los documento_extras
routerDocuemntoExtra.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los documento_extras")
    sequelize.documento_extra.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar documento_extras', err);
      res.send('Error al mostrar documento_extras', err)
    })
})

//[DELETE] Eliminar documento_extra con su ID
routerDocuemntoExtra.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando documento_extra con id: ", req.query.id)
    sequelize.documento_extra.destroy({
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
        console.log('Error al eliminar documento_extra', err);
    })
})

//[POST] Crear un documento_extra con los datos recibidos
routerDocuemntoExtra.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_practica, nombre_solicitud, descripcion, tipo_archivo, key} = req.body;
  console.log("Request de creacion de documento_extra recibida");
  sequelize.documento_extra.create({
      id_practica: id_practica,
      nombre_solicitud: nombre_solicitud,
      descripcion: descripcion,
      tipo_archivo: tipo_archivo,
      key: key

  })
  .then((resultados:any) => {
      res.send("documento_extra creado");
  })
  .catch((err:any) => {
      console.log('Error al crear documento_extra',err);
  })
})

//[PUT]
routerDocuemntoExtra.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const documento_extra = await sequelize.documento_extra.findOne({ where: { id: req.body.id } })
    if (documento_extra){
      documento_extra.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de documento_extra', err);
      })
    } else {
        console.log("No existe documento_extra con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerDocuemntoExtra;