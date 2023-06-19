export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerEstudiante = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener un estudiante con su ID
routerEstudiante.get('', (req: any, res: any) => {
    console.log("Obteniendo estudiante de id: ", req.query.id)
    sequelize.estudiante.findOne({
        where: {
            id: req.query.id
        }
    })
        .then((resultados: any) => {
            res.send(resultados);
        })
        .catch((err: any) => {
            console.log('Error al obtener estudiante', err);
        })
})

//[GET] mostrar todos los estudiantes
routerEstudiante.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los estudiantes")
    sequelize.estudiante.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar estudiantes', err);
      res.send('Error al mostrar estudiantes', err)
    })
})

//[DELETE] Eliminar estudiante con su ID
routerEstudiante.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando estudiante con id: ", req.query.id)
    sequelize.estudiante.destroy({
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
        console.log('Error al eliminar estudiante', err);
    })
})

//[POST] Crear un estudiante con los datos recibidos
routerEstudiante.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_usuario, nombre, rol, rut, correo} = req.body;
  console.log("Request de creacion de estudiante recibida");
  sequelize.estudiante.create({
      id_usuario: id_usuario,
      nombre: nombre,
      rol: rol,
      rut: rut,
      correo: correo
  })
  .then((resultados:any) => {
      res.send("Estudiante creado");
  })
  .catch((err:any) => {
      console.log('Error al crear estudiante',err);
  })
})

//[PUT]
routerEstudiante.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const estudiante = await sequelize.estudiante.findOne({ where: { id: req.body.id } })
    if (estudiante){
      estudiante.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar de estudiante', err);
      })
    } else {
        console.log("No existe estudiante con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerEstudiante;