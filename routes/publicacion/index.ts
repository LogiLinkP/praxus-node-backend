export { };

const { publicacion } = require('../../models');
const { Router } = require('express');
const routerpublicacion = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] Obtener todas las publicaciones de una carrera
routerpublicacion.get('/todas', jsonParser, async (req:any, res:any) => {
  try{
    const id_carrera = req.query.id_carrera;
    if(!id_carrera){
      return res.status(400).json({message: "Debe ingresar id_carrera"});
    }

    const data = await publicacion.findAll({
        where: {
            id_carrera: id_carrera,
            enviable: true
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

//[GET] Obtener las publicaciones de un encargado

routerpublicacion.get('/encargado', jsonParser, async (req:any, res:any) => {
  try{
    const id_encargado = req.query.id_encargado;
    if(!id_encargado){
      return res.status(400).json({message: "Debe ingresar id_encargado"});
    }

    const data = await publicacion.findAll({
        where: {
            id_encargado: id_encargado,
            enviable: true
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

//[POST] Agregar una nueva publicacion

routerpublicacion.post('/crear', jsonParser, (req: any, res: any) => {
  console.log(req.body)
  const {id_encargado, id_carrera, titulo, enunciado, fecha, isfijo, fecha_programada} = req.body;
  console.log("Request de creacion de publicacion recibida");

  let publienviable:boolean;
  if(fecha_programada != null){
    publienviable = false
  } else publienviable = true;
  
  publicacion.create({
      id_encargado: id_encargado,
      id_carrera: id_carrera,
      titulo: titulo,
      enunciado: enunciado,
      fecha: fecha,
      isfijo: isfijo,
      fecha_programada: fecha_programada,
      enviable:publienviable,
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.status(200).json(resultados);
  })
  .catch((err:any) => {
      console.log('Error al crear publicacion', err);
      res.status(500).json({ message: "Error al crear publicacion", error: err});
  })
})

//[PUT] Modificar el titulo y/o enunciado de una publicacion

routerpublicacion.put('/editar', jsonParser, async (req: any, res: any) => {
  const Publicacion = await publicacion.findOne({ where: { id: req.body.id } })
  if (Publicacion) {
    Publicacion.update({ titulo: req.body.titulo, enunciado: req.body.enunciado })
      .then((resultados: any) => {
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar publicacion', err);
      })
  } else {
    console.log("No existe publicacion con id: ", req.query.id)
    res.sendStatus(404)
    }
})

//[DELETE] Borrar Publicación
routerpublicacion.delete('/eliminar', (req:any, res:any) => {
  console.log(req.query)
  console.log(req.body)
  const Publicacion = publicacion.findOne({ where: { id: req.query.id } })
  if(!Publicacion){
    return res.status(400).json({message: "No hay publicacion"});
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
    console.log('Error al eliminar publicacion', err);
  })
})

module.exports = routerpublicacion;