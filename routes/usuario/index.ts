export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerUsuario = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] mostrar todos los usuarios
routerUsuario.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los usuarios")
    sequelize.usuario.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar usuarios', err);
      res.send('Error al mostrar usuarios', err);
    })
})

//[GET] para obtener un usuario con su ID
routerUsuario.get('', (req: any, res: any) => {
    console.log("Obteniendo usuario de id: ", req.query.id)
    sequelize.usuario.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener usuario', err);
        })
})

//[POST] Crear un usuario con los datos recibidos
routerUsuario.post('/crear', jsonParser, (req: any, res: any) => {
    const {correo, password, nombre, es_encargado, es_supervisor, es_estudiante, es_admin, config} = req.body;
    console.log("Request de creacion de usuario recibida");
    // hacer post a python backend
    sequelize.usuario.create({
        correo: correo,
        password: password,
        nombre: nombre,
        es_encargado: es_encargado,
        es_supervisor: es_supervisor,
        es_estudiante: es_estudiante,
        es_admin: es_admin,
        config: config

    })
    .then((resultados:any) => {
        console.log(resultados);
        res.send("Usuario creado");
    })
    .catch((err:any) => {
        console.log('Error al crear usuario',err);
    })
})

//[DELETE] Eliminar usuario con su ID
routerUsuario.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando usuario con id: ", req.query.id)
    sequelize.usuario.destroy({
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
      console.log('Error al eliminar usuario', err);
    })
})

//[PUT]
routerUsuario.put('/actualizar', jsonParser, async (req:any, res:any) => {
  const usuario = await sequelize.usuario.findOne({ where: { id: req.body.id } })
  if (usuario){
    usuario.update(req.body)
    .then((resultados:any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err:any) => {
      res.send(500)
      console.log('Error al actualizar usuario', err);
    })
  } else {
      console.log("No existe usuario con id: ", req.query.id)
      res.sendStatus(404)
  }
})

module.exports = routerUsuario;