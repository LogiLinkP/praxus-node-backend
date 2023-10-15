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
router_documento_encargado.post('/crear', jsonParser, (req: any, res: any) => {
  console.log(req.body)
  const {id_carrera, id_encargado, nombre, tipo, key} = req.body;
  console.log("Request de creacion de documento recibida");

  documento_encargado.create({
      id_encargado: id_encargado,
      id_carrera: id_carrera,
      nombre:nombre,
      tipo:tipo,
      key:key,
  })
  .then((resultados:any) => {
      console.log(resultados);
      console.log("DOCUMENTO GUARDADO")
      res.status(200).json(resultados);
  })
  .catch((err:any) => {
      console.log('Error al crear documento', err);
      res.status(500).json({ message: "Error al crear documento", error: err});
  })
})

//[DELETE] Borrar Publicación
router_documento_encargado.delete('/eliminar', (req:any, res:any) => {
  const Docu = documento_encargado.findOne({ where: { id: req.query.id } })
  if(!Docu){
    return res.status(400).json({message: "No hay documento"});
  }
  Docu.destroy({
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
    console.log('Error al eliminar documento', err);
  })
})

module.exports = router_documento_encargado;