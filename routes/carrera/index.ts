export { };

const { carrera } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerCarrera = new Router(); // /carrera

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerCarrera.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await carrera.findOne({
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

//[GET] mostrar todos
routerCarrera.get('/todos', async (req: any, res: any) => {
  try {
    const data = await carrera.findAll();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerCarrera.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando carrera con id: ", req.query.id)
  carrera.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      res.status(200).json(resultados);
    })
    .catch((err: any) => {
      res.status(500).json(err)
      console.log('Error al eliminar carrera', err);
    })
})

//[POST] Crear uno
routerCarrera.post('/crear', jsonParser, (req: any, res: any) => {
  const { nombre, ramos, correos_admitidos, estadistica_ramos, palabras_clave } = req.body;
  console.log("Request de carrera");
  carrera.create({
    nombre: nombre,
    ramos: ramos,
    correos_admitidos: correos_admitidos,
    estadistica_ramos: estadistica_ramos,
    palabras_clave: palabras_clave
  })
    .then((resultados: any) => {
      res.status(200).json({ message: "carrera creada", id: resultados.id });;
    })
    .catch((err: any) => {
      res.status(500).json({ message: "Error interno" });
      console.log('Error al crear carrera', err);
    })
})


//[PUT]
routerCarrera.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Carrera = await carrera.findOne({ where: { id: req.body.id } })
  if (Carrera) {
    // actualizar practica
    Carrera.update(req.body)
      .then((resultados: any) => {
        res.status(200).json({ resultado: resultados });
      })
      .catch((err: any) => {
        res.status(500).json({ message: "Error al actualizar carrera", error: err });
      })
  } else {
    console.log("No existe carrera con id: ", req.query.id)
    res.status(404).json({ message: "No existe carrera con id: " + req.query.id });
  }
})

//Implementar con bulkCreate
routerCarrera.post('/crear-carrera', jsonParser, async (req: any, res: any) => {
  let { lista } = req.body;
  let listaCarreras = [];
  let flag = false;
  for(let i=0; i<lista.length; i++){
    let json = {nombre: lista[i]};
    try{
      const _query = carrera.findOne({ where: json});
      if(_query.length > 0){
        flag = true;
        continue;
      }
      else{
        listaCarreras.push(json);
      }
    }catch(error){
      console.log(error);
      return res.status(500).send({ message: "Error de conexion" });
    }
  }
  try {
    const _carreras = await carrera.bulkCreate(listaCarreras);
    return res.status(200).send({ message: "Carrera(s) creada exitosamente", carreras: _carreras });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error de conexion" });
  }
})

module.exports = routerCarrera;