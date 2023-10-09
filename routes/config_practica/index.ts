import { where } from "sequelize";

export { };

const { config_practica, modalidad } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerConfigPracticas = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener una config_practica con su ID
routerConfigPracticas.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await config_practica.findOne({
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

//[GET] obtener una config_practica con nombre, modalidad y cantidad_tiempo 
routerConfigPracticas.get('/buscar', async (req: any, res: any) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      res.status(406).json({ message: "Se requiere ingresar nombre de config_practica" });
      return;
    }
    const activada = req.query.activada == "true";
    let where: any = { nombre };
    if (activada) {
      where["activada"] = activada;
    }

    const data = await config_practica.findOne({ where });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno" });
  }
});


//[GET] obtener una config_practica por nombre SÓLO SI ESTÁ ACTIVADA
routerConfigPracticas.get('/nombre', async (req: any, res: any) => {
  try {
    const { nombre, id_carrera } = req.query;
    if (!nombre || !id_carrera) {
      res.status(406).json({ message: "Se requiere ingresar nombre e id_carrera de config_practica" });
      return;
    }
    const data = await config_practica.findOne({
      where: {
        nombre: nombre,
        activada: true,
        id_carrera: id_carrera
      },
      include: [{ model: modalidad }]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] obtener las config_practica por carrera SÓLO SI ESTÁN ACTIVADAS
routerConfigPracticas.get('/carrera', async (req: any, res: any) => {
  try {
    const { id_carrera } = req.query;
    if (!id_carrera) {
      res.status(406).json({ message: "Se requiere ingresar id_carrera de config_practica" });
      return;
    }
    const data = await config_practica.findAll({
      where: {
        activada: true,
        id_carrera: id_carrera
      },
      include: [{ model: modalidad }]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});


//[GET] mostrar todas las config_practicas
routerConfigPracticas.get('/todos', async (req: any, res: any) => {
  try {
    const data = await config_practica.findAll({
      include: [modalidad]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});


//[DELETE] Eliminar config_practica con su ID
routerConfigPracticas.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando config_practica con id: ", req.query.id)
  config_practica.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.status(200).json(resultados);
    })
    .catch((err: any) => {
      res.status(500).json(err)
      console.log('Error al eliminar config_practica', err);
    })
})

//[POST] Crear una config_practica con los datos recibidos
routerConfigPracticas.post('/crear', jsonParser, (req: any, res: any) => {
  const { nombre, frecuencia_informes, informe_final, id_carrera, activada } = req.body;
  console.log("Request de creacion de config_practica recibida");
  config_practica.create({
    nombre: nombre,
    frecuencia_informes: frecuencia_informes,
    informe_final: informe_final,
    id_carrera: id_carrera,
    activada: activada
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.status(200).json({ message: "config_practica creada", id: resultados.id });
    })
    .catch((err: any) => {
      console.log('Error al crear config_practica', err);
      res.status(500).json({ message: "Error al crear config_practica", error: err });
    })
})

//[PUT]
routerConfigPracticas.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Config_practica = await config_practica.findOne({ where: { id: req.body.id } })
  if (Config_practica) {
    // actualizar practica
    Config_practica.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.status(200).json(resultados);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar config_practica', err);
      })
  } else {
    console.log("No existe config_practica con id: ", req.body.id)
    res.sendStatus(404)
  }
})

module.exports = routerConfigPracticas;