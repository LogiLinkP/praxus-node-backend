export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerSolicitudDocumento = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un solicitud_documento con su ID
routerSolicitudDocumento.get('', (req: any, res: any) => {
    console.log("Obteniendo solicitud_documento de id: ", req.query.id)
    sequelize.solicitud_documento.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener solicitud_documento', err);
        })
})

//[GET] mostrar todos los solicitud_documentos
routerSolicitudDocumento.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los solicitud_documentos")
    sequelize.solicitud_documento.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar solicitud_documentos', err);
      res.send('Error al mostrar solicitud_documentos', err)
    })
})

//[DELETE] Eliminar solicitud_documento con su ID
routerSolicitudDocumento.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando solicitud_documento con id: ", req.query.id)
    sequelize.solicitud_documento.destroy({
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
        console.log('Error al eliminar solicitud_documento', err);
    })
})

//[POST] Crear un solicitud_documento con los datos recibidos
routerSolicitudDocumento.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_config_practica, tipo_archivo, nombre_solicitud, descripcion} = req.body;
  console.log("Request de creacion de solicitud_documento recibida");
  sequelize.solicitud_documento.create({
      id_config_practica: id_config_practica,
      tipo_archivo: tipo_archivo,
      nombre_solicitud: nombre_solicitud,
      descripcion: descripcion
  })
  .then((resultados:any) => {
      res.send("solicitud_documento creado");
  })
  .catch((err:any) => {
      console.log('Error al crear solicitud_documento',err);
  })
})

//[PUT]
routerSolicitudDocumento.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const solicitud_documento = await sequelize.solicitud_documento.findOne({ where: { id: req.body.id } })
    if (solicitud_documento){
      solicitud_documento.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de solicitud_documento', err);
      })
    } else {
        console.log("No existe solicitud_documento con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerSolicitudDocumento;