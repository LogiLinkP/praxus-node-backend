export { };

const { empresa } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerEmpresa = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerEmpresa.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await empresa.findOne({
      where: {
        id: req.query.id
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ message: "Error interno" });
  }
});

//[GET] mostrar todos
routerEmpresa.get('/todos', async (req: any, res: any) => {
  try {
    const data = await empresa.findAll();
    if (!data || data.length == 0) {
      res.status(404).json({ message: "No existen empresas" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerEmpresa.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando empresa con id: ", req.query.id)
  empresa.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err: any) => {
      res.sendStatus(500);
      console.log('Error al eliminar empresa', err);
    })
})

//[POST] Crear uno
routerEmpresa.post('/crear', jsonParser, (req: any, res: any) => {
  const { nombre_empresa, rut_empresa, empresa_verificada, dominios_empresa, practicantes_destacados, calificacion_promedio } = req.body;
  console.log("Request de empresa");
  empresa.create({
    nombre_empresa: nombre_empresa,
    rut_empresa: rut_empresa,
    empresa_verificada: empresa_verificada,
    dominios_empresa: dominios_empresa,
    practicantes_destacados: practicantes_destacados,
    calificacion_promedio: calificacion_promedio
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.status(200).json({ id: resultados.dataValues.id });
    })
    .catch((err: any) => {
      console.log('Error al crear empresa', err);
      res.sendStatus(500).json({ message: "Error interno" });
    })
})


//[PUT]
routerEmpresa.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Empresa = await empresa.findOne({ where: { id: req.body.id } })
  if (Empresa) {
    // actualizar practica
    Empresa.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.sendStatus(500).json({ message: "Error interno" });
        console.log('Error al actualizar empresa', err);
      })
  } else {
    console.log("No existe empresa con id: ", req.query.id)
    res.sendStatus(404);
  }
})

module.exports = routerEmpresa;