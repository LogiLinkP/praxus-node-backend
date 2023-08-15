export { };

const { documento_extra } = require("../../models");
const { Router } = require('express');
const sequelize = require('../../db');
const routerDocumentoExtra = new Router(); // /documento_extra

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { uploadFile, deleteFile, checkFileType } = require("../../middleware/file_utils");


//[GET] para obtener un documento_extra con su ID
routerDocumentoExtra.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await documento_extra.findOne({
      where: {
        id: req.query.id
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await documento_extra.findOne({
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

//[GET] mostrar todos los documentos_extra
routerDocumentoExtra.get('/todos', async (req: any, res: any) => {
  try {
    const data = await documento_extra.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener todos los documentos_extra de acuerdo al id de la practica
routerDocumentoExtra.get('/get', (req: any, res: any) => {
  console.log("Obteniendo documentos_extra con id de practica: ", req.query.id_practica)
  documento_extra.findAll({
    where: {
      id_practica: req.query.id_practica
    }
  })
    .then((resultados: any) => {
      res.send(resultados);
    })
    .catch((err: any) => {
      console.log('Error al obtener documentos_extra', err);
    })
})

//[GET] para descargar un documento extra con su ID
routerDocumentoExtra.get('/download', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await documento_extra.findOne({
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

//[DELETE] Eliminar documento_extra con su ID
routerDocumentoExtra.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando documento_extra con id: ", req.query.id)
  documento_extra.destroy({
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
      console.log('Error al eliminar documento_extra', err);
    })
})


//[POST] Crear un documento_extra con los datos recibidos
routerDocumentoExtra.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_practica, nombre_solicitud, descripcion, tipo_archivo, fecha_subida, fecha_solicitud } = req.body;
  let validacion = [id_practica, nombre_solicitud, tipo_archivo].every(Boolean);
  if (!validacion) {
    return res.status(400).send({
      message: 'Faltan campos obligatorios'
    });
  }
  documento_extra.create({
    id_practica: id_practica,
    nombre_solicitud: nombre_solicitud,
    descripcion: descripcion || null,
    tipo_archivo: tipo_archivo,
    key: null,
    fecha_subida: fecha_subida,
    fecha_solicitud: fecha_solicitud
  })
    .then((resultados: any) => {
      res.send("documento_extra creado");
    })
    .catch((err: any) => {
      console.log('Error al crear documento_extra', err);
    })
})

//[PUT] Agrega la key de un documento ya subido a la solicitud
routerDocumentoExtra.put('/agregar_documento', uploadFile.single("file"), async (req: any, res: any) => {
  try {
    const id_documento_extra = req.body.id_documento_extra;
    if (!id_documento_extra) {
      console.log("No se ingreso id de documento_extra");
      deleteFile(req.file.path);
      return res.sendStatus(400);
    }
    console.log(1)
    const key = req.file.filename;
    if (!key) {
      console.log("No se ingreso key de documento_extra");
      deleteFile(req.file.path);
      return res.sendStatus(400);
    }
    console.log(2)
    const DocumentoExtra = await documento_extra.findOne({ where: { id: id_documento_extra } });
    if (!DocumentoExtra) {
      console.log("No existe documento_extra con id: ", id_documento_extra);
      deleteFile(req.file.path);
      return res.sendStatus(404)
    }
    console.log(3)
    let filetypes = DocumentoExtra.tipo_archivo.split(",");
    if (!(await checkFileType(req.file.path, filetypes))) {
      console.log("El archivo no tiene el formato correcto");
      deleteFile(req.file.path);
      return res.sendStatus(415);
    }
    console.log(4)
    DocumentoExtra.update({ key })
    return res.sendStatus(200);
  } catch (error) {
    console.log('Error al actualizar documento_extra', error);
    return res.sendStatus(500);
  }
});

module.exports = routerDocumentoExtra;