export { };

const { publicacion } = require('../../models');
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

    const data = await publicacion.findAll({
        where: {
            id_carrera: id_carrera,
        }
    })

    if(!data){
      return res.status(400).json({message: "No se pudo encontrar la practica"});
    }
    console.log("Publicaciones Obtenidas")
    res.send(data)
  }catch(err) {
      console.log('Error al mostrar todas las publicaciones', err);
      res.send('Error al mostrar todas las publicaciones', err);
    }
})

//[GET] Obtener las documentación de un encargado
router_documento_encargado.get('/encargado', jsonParser, async (req:any, res:any) => {
  try{
    const id_encargado = req.query.id_encargado;
    if(!id_encargado){
      return res.status(400).json({message: "Debe ingresar id_encargado"});
    }

    const data = await publicacion.findAll({
        where: {
            id_encargado: id_encargado,
        }
    })

    if(!data){
      return res.status(400).json({message: "No se pudo encontrar la practica"});
    }
    console.log("Publicaciones Obtenidas")
    res.send(data)
  }catch(err) {
      console.log('Error al mostrar todas las publicaciones', err);
      res.send('Error al mostrar todas las publicaciones', err);
    }
})

//[POST] Agregar un nuevo documento
router_documento_encargado.post('/crear', jsonParser, (req: any, res: any) => {
  console.log(req.body)
  const {id_carrera, id_encargado, nombre, tipo} = req.body;
  console.log("Request de creacion de documento recibida");

  publicacion.create({
      id_encargado: id_encargado,
      id_carrera: id_carrera,
      nombre:nombre,
      tipo:tipo,
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.status(200).json(resultados);
  })
  .catch((err:any) => {
      console.log('Error al crear documento', err);
      res.status(500).json({ message: "Error al crear documento", error: err});
  })
})

//[DELETE] Borrar Publicación
router_documento_encargado.delete('/eliminar', (req:any, res:any) => {
  const Publicacion = publicacion.findOne({ where: { id: req.query.id } })
  if(!Publicacion){
    return res.status(400).json({message: "No hay documento"});
  }
  publicacion.destroy({
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