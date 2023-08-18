export { };

const { documento, practica, solicitud_documento } = require("../../models");
const { uploadFile, deleteFile, checkFileType } = require("../../middleware/file_utils");

const { Router } = require('express');
const sequelize = require('../../db');
const routerDocumento = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener datos de un documento con su ID
routerDocumento.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await documento.findOne({
      where: {
        id: req.query.id
      },
      include: [solicitud_documento]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] mostrar todos los documentos
routerDocumento.get('/todos', async (req: any, res: any) => {
  try {
    const data = await documento.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener todos datos de los documentos de acuerdo al id de la practica
routerDocumento.get('/get', (req: any, res: any) => {
  console.log("Obteniendo documentos con id de practica: ", req.query.id_practica)
  documento.findAll({
    where: {
      id_practica: req.query.id_practica
    },
    include: [solicitud_documento]
  })
    .then((resultados: any) => {
      res.send(resultados);
    })
    .catch((err: any) => {
      console.log('Error al obtener documentos', err);
    })
})

//[GET] para descargar un documento con su ID
routerDocumento.get('/download', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await documento.findOne({
      where: {
        id: req.query.id
      }
    });
    return res.download(`./tmp/${data.key}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar documento con su ID
routerDocumento.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando documento con id: ", req.query.id)
  documento.destroy({
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
      console.log('Error al eliminar documento', err);
    })
})


//[POST] Crear un documento con los datos recibidos
routerDocumento.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_practica, id_solicitud_documento, key, fecha_subida } = req.body;
  console.log("Request de creacion de documento recibida");
  documento.create({
    id_practica: id_practica,
    id_solicitud_documento: id_solicitud_documento,
    key: key,
    fecha_subida: fecha_subida
  })
    .then((resultados: any) => {
      res.send("documento creado");
    })
    .catch((err: any) => {
      console.log('Error al crear documento', err);
    })
})

//[PUT]
routerDocumento.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Documento = await documento.findOne({ where: { id: req.body.id } })
  if (Documento) {
    // actualizar practica
    Documento.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar documento', err);
      })
  } else {
    console.log("No existe documento con id: ", req.query.id)
    res.sendStatus(404)
  }
})


//[POST] Crear un nuevo registro en la tabla documento y subir el archivo, dado el id de la solicitud y el id de la practica
routerDocumento.post('/upload', uploadFile.single('file'), async (req: any, res: any) => {
  try {
    const { id_solicitud, id_practica } = req.body;
    if (!id_solicitud || !id_practica) {
      console.log("No se ingreso id de solicitud o id de practica");
      deleteFile(req.file.path);
      return res.sendStatus(400);
    }
    const key = req.file.filename;
    if (!key) {
      console.log("No se ingreso key de documento");
      deleteFile(req.file.path);
      return res.sendStatus(400);
    }
    const Documento = await documento.create({
      id_practica: id_practica,
      id_solicitud_documento: id_solicitud,
      key: key,
      fecha_subida: new Date()
    });
    res.status(200).json(Documento);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});




module.exports = routerDocumento;