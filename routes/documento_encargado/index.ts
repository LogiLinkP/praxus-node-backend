import dotenv from 'dotenv';
const { memoryFile } = require('../../middleware/file_utils');
dotenv.config();

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  // GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs")

const s3Client = new S3Client({
  region: process.env.bucketRegion,
  credentials: {
    accessKeyId: process.env.bucketUserAccessKey,
    secretAccessKey: process.env.bucketUserSecretAccessKey,
  }
});

export { };

const { documento_encargado } = require('../../models');
const { Router } = require('express');
const router_documento_encargado = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] Obtener toda la documentación de una carrera
router_documento_encargado.get('/todas', jsonParser, async (req:any, res:any) => {
  try{
    const id_carrera = req.query.id_carrera;
    if(!id_carrera){
      return res.status(400).json({message: "Debe ingresar id_carrera"});
    }

    const data = await documento_encargado.findAll({
        where: {
            id_carrera: id_carrera,
        }
    })

    if(!data){
      return res.status(400).json({message: "No se pudieron encontrar los documentos"});
    }
    console.log("Documentos Obtenidos")
    res.send(data)
  }catch(err) {
      console.log('Error al mostrar todos los documentos', err);
      res.send('Error al mostrar todos los documentos', err);
    }
})

//[GET] Obtener las documentación de un encargado
router_documento_encargado.get('/encargado', jsonParser, async (req:any, res:any) => {
  try{
    const id_encargado = req.query.id_encargado;
    if(!id_encargado){
      return res.status(400).json({message: "Debe ingresar id_encargado"});
    }

    const data = await documento_encargado.findAll({
        where: {
            id_encargado: id_encargado,
        }
    })

    if(!data){
      return res.status(400).json({message: "No se pudieron encontrar los documentos"});
    }
    console.log("Documentos Obtenidos")
    res.send(data)
  }catch(err) {
      console.log('Error al mostrar todos los documentos', err);
      res.send('Error al mostrar todas los documentos', err);
    }
})

//[POST] Agregar un nuevo documento

async function uploadFile(filePath:any, key:string) {
  
  return s3Client.send(
      new PutObjectCommand({
          Bucket: process.env.bucketName,
          Key: key,
          Body: filePath,
      })
  );
}

router_documento_encargado.post('/crear', memoryFile.single("file"), async (req: any, res: any) => {
  try{
    const archivo = req.file.buffer
    const {id_encargado, id_carrera, tipo, nombre, key} = req.body;
    console.log("Request de creacion de documento recibida");

    uploadFile(archivo, key)
    await documento_encargado.create({
      id_encargado:+ id_encargado,
      id_carrera:+ id_carrera,
      nombre:nombre,
      tipo:tipo,
      key:key,
    })
    console.log("Documento Guardado")
    res.status(200).json({message: "Documento Guardado"});
  } catch (error:any) {
    console.log('Error al crear documento', error);
    res.status(500).json({ message: "Error al crear documento"});
  }
})

//[DELETE] Borrar Publicación
router_documento_encargado.delete('/eliminar', async (req:any, res:any) => {
  try{   
    const Docu = await documento_encargado.findOne({ where: { id: req.query.id } })
    if(!Docu){
      return res.status(400).json({message: "No hay documento"});
    }
    console.log("Documento: ", Docu)

    const input = {
      "Bucket": process.env.bucketName,
      "Key": Docu.key
    };
    const command = new DeleteObjectCommand(input);
    await s3Client.send(command);

    await documento_encargado.destroy({
      where: {
        id: req.query.id
      }
    })
    console.log("Documento Eliminado")
    res.status(200).json({message: "Documento Eliminado"});
   }catch(err:any) {
    res.status(500).json({message: "Error al eliminar documento"})
    console.log('Error al eliminar documento', err);
  }
})
module.exports = router_documento_encargado;