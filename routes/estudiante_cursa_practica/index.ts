export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerEstuCursaPract = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerEstuCursaPract.get('', (req: any, res: any) => {
    console.log("Obteniendo estudiante_cursa_practica de id: ", req.query.id)
    sequelize.estudiante_cursa_practica.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener estudiante_cursa_practica', err);
    })
})

//[GET] mostrar todos
routerEstuCursaPract.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los estudiante_cursa_practica")
    sequelize.estudiante_cursa_practica.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar estudiante_cursa_practicas', err);
      res.send('Error al mostrar estudiante_cursa_practicas', err)
    })
})

//[DELETE] Eliminar
routerEstuCursaPract.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando estudiante_cursa_practica con id: ", req.query.id)
  sequelize.estudiante_cursa_practica.destroy({
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
    console.log('Error al eliminar estudiante_cursa_practica', err);
  })
})

//[POST] Crear uno
routerEstuCursaPract.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_estudiante, id_practica, estado, nombre_supervisor, correo_supervisor, 
    nombre_empresa, rut_empresa, fecha_inicio, fecha_termino, nota_evaluacion,
    consistencia_informe, consistencia_nota, key_informe_supervisor} = req.body; //CAMBIAR ESTO
  console.log("Request de creacion de practica recibida");
  sequelize.estudiante_cursa_practica.create({
      id_estudiante: id_estudiante,
      id_practica: id_practica,
      estado: estado,
      nombre_supervisor: nombre_supervisor,
      correo_supervisor: correo_supervisor,
      nombre_empresa: nombre_empresa,
      rut_empresa: rut_empresa,
      fecha_inicio: fecha_inicio,
      fecha_termino: fecha_termino,
      nota_evaluacion: nota_evaluacion,
      consistencia_informe: consistencia_informe,
      consistencia_nota: consistencia_nota,
      key_informe_supervisor: key_informe_supervisor
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("Estudiante_cursa_practica creado");
  })
  .catch((err:any) => {
      console.log('Error al crear estudiante_cursa_practica',err);
  })
})


//[PUT]
routerEstuCursaPract.put('/actualizar', jsonParser, async (req:any, res:any) => {
    // buscar estudiante_cursa_practica por id
    const estuCursaPract = await sequelize.estudiante_cursa_practica.findOne({ where: { id: req.body.id } })
    if (estuCursaPract){
        // actualizar estudiante_cursa_practica
      estuCursaPract.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar estudiante_cursa_practica', err);
      })
    } else {
        console.log("No existe estudiante_cursa_practica con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerEstuCursaPract;