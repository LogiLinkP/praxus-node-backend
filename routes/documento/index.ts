export { };

const { documento, practica } = require("../../models");
const upload = require("../../middleware/upload_file");

const { Router } = require('express');
const sequelize = require('../../db');
const routerDocumento = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

routerDocumento.post('/upload', upload.single("file"), async (req: any, res: any) => {
    try {
        console.log(req.file);
        const _practica = await practica.findOne({
            where: {
                id_config_practica: 1,
                id_estudiante: +req.body.id_estudiante,
            }
        });
        const doc = await documento.create({
            id_practica: _practica.id,
            key: req.file.filename,
        });
        res.status(200).json({ message: "Archivo subido correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al subir el archivo" });
    }

});

//[GET] para obtener un documento con su ID
routerDocumento.get('', (req: any, res: any) => {
    console.log("Obteniendo documento de id: ", req.query.id)
    sequelize.documento.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener documento', err);
        })
})

//[GET] mostrar todos los documentos
routerDocumento.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los documentos")
    sequelize.documento.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar documentos', err);
      res.send('Error al mostrar documentos', err)
    })
})

//[DELETE] Eliminar documento con su ID
routerDocumento.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando documento con id: ", req.query.id)
    sequelize.documento.destroy({
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
        console.log('Error al eliminar documento', err);
    })
})

//[POST] Crear un documento con los datos recibidos
routerDocumento.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_practica, id_solicitud_documento, key} = req.body;
  console.log("Request de creacion de documento recibida");
  sequelize.documento.create({
      id_practica: id_practica,
        id_solicitud_documento: id_solicitud_documento,
        key: key
      
  })
  .then((resultados:any) => {
      res.send("documento creado");
  })
  .catch((err:any) => {
      console.log('Error al crear documento',err);
  })
})

//[PUT]
routerDocumento.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const documento = await sequelize.documento.findOne({ where: { id: req.body.id } })
    if (documento){
      documento.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de documento', err);
      })
    } else {
        console.log("No existe documento con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerDocumento;