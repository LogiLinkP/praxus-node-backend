export { };

const { publicacion } = require('../../models');
const { Router } = require('express');
const routerpublicacion = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] Obtener todas las publicaciones de una carrera
routerpublicacion.get("/todas",  (req:any, res:any) => {
    publicacion.findAll({
        where: {
            id_carrera: req.query.id_carrera
        }
    })
    .then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar todas las publicaciones', err);
      res.send('Error al mostrar todas las publicaciones', err);
    })
})

//[GET] Obtener las publicaciones de un encargado

routerpublicacion.get("/encargado",  (req:any, res:any) => {
  publicacion.findAll({
      where: {
          id_encargado: req.query.id_encargado
      }
  })
  .then((resultados:any) => {
    res.send(resultados)
  })
  .catch((err:any) => {
    console.log('Error al mostrar las publicaciones', err);
    res.send('Error al mostrar las publicaciones', err);
  })
})

//[POST] Agregar una nueva publicacion

routerpublicacion.post('/crear', jsonParser, (req: any, res: any) => {
    const {id_encargado, id_carrera, titulo, enunciado, fecha, isfijo} = req.body;
    console.log("Request de creacion de publicacion recibida");
    publicacion.create({
        id_encargado: id_encargado,
        id_carrera: id_carrera,
        titulo: titulo,
        enunciado: enunciado,
        fecha: fecha,
        isfijo: isfijo,
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