export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerPractica = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerPractica.get('', (req: any, res: any) => {
    console.log("Obteniendo practica de id: ", req.query.id)
    sequelize.practica.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener practica', err);
    })
})

//[GET] mostrar todos
routerPractica.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todas las practica")
    sequelize.practica.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar practicas', err);
      res.send('Error al mostrar practicas', err)
    })
})

//[DELETE] Eliminar
routerPractica.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando practica con id: ", req.query.id)
  sequelize.practica.destroy({
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
    console.log('Error al eliminar practica', err);
  })
})

//[POST] Crear uno
routerPractica.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_estudiante, id_config_practica, estado, nombre_supervisor, correo_supervisor, 
    nombre_empresa, rut_empresa, fecha_inicio, fecha_termino, nota_evaluacion,
    consistencia_informe, consistencia_nota, key_informe_supervisor} = req.body;
  console.log("Request de creacion de practica recibida");
  sequelize.practica.create({
      id_estudiante: id_estudiante,
      id_config_practica: id_config_practica,
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
      res.sendStatus(200)
      console.log("practica creada");
  })
  .catch((err:any) => {
      res.sendStatus(500)
      console.log('Error al crear practica');
  })
})


//[PUT]
routerPractica.put('/actualizar', jsonParser, async (req:any, res:any) => {
    // buscar practica por id
    const Practica = await sequelize.practica.findOne({ where: { id: req.body.id } })
    if (Practica){
        // actualizar practica
      Practica.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar practica', err);
      })
    } else {
        console.log("No existe practica con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerPractica;