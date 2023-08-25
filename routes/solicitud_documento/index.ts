export { };

const { solicitud_documento } = require("../../models");
const { Router } = require('express');
const sequelize = require('../../db');
const routerSolicitudDocumento = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un solicitud_documento con su ID
routerSolicitudDocumento.get('', async (req: any, res: any) => {
    try {
      if (!("id" in req.query)) {
        res.status(406).json({ message: "Se requiere ingresar id" });
        return;
      }
      const data = await solicitud_documento.findOne({
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
routerSolicitudDocumento.get('/id_config_practica', async (req: any, res: any) => {
    try {
      if (!("id" in req.query)) {
        res.status(406).json({ message: "Se requiere ingresar id" });
        return;
      }
      const data = await solicitud_documento.findAll({
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

//[GET] mostrar todos los solicitud_documentos
routerSolicitudDocumento.get('/todos', async (req: any, res: any) => {
    try {
      const data = await solicitud_documento.findAll();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error interno" });
    }
  });

//[DELETE] Eliminar solicitud_documento con su ID
routerSolicitudDocumento.delete('/eliminar', (req: any, res: any) => {
    console.log("Eliminando solicitud_documento con id: ", req.query.id)
    solicitud_documento.destroy({
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
        console.log('Error al eliminar solicitud_documento', err);
      })
  })


//[POST] Crear un solicitud_documento con los datos recibidos
routerSolicitudDocumento.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_config_practica, tipo_archivo, nombre_solicitud, descripcion} = req.body;
  console.log("Request de creacion de solicitud_documento recibida");
  solicitud_documento.create({
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
    const Solicitud_documento = await solicitud_documento.findOne({ where: { id: req.body.id } })
    if (Solicitud_documento){
      Solicitud_documento.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar solicitud_documento', err);
      })
    } else {
        console.log("No existe solicitud_documento con id: ", req.query.id)
        res.sendStatus(404)
    }
})


module.exports = routerSolicitudDocumento;