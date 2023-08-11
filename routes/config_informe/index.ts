export { };

const { config_informe } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerConfigInforme = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerConfigInforme.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await config_informe.findOne({
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
routerConfigInforme.get('/todos', async (req: any, res: any) => {
  try {
    const data = await config_informe.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerConfigInforme.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando config_informe con id: ", req.query.id)
  config_informe.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err: any) => {
      res.send(500)
      console.log('Error al eliminar config_practica', err);
    })
})

//[POST] Crear uno
routerConfigInforme.post('/crear', jsonParser, (req: any, res: any) => {
  const {id_config_practica, tipo_informe} = req.body;
  console.log("Request de config_informe");
  config_informe.create({
    id_config_practica: id_config_practica,
    tipo_informe: tipo_informe,
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("config_informe creado");
  })
  .catch((err:any) => {
      console.log('Error al crear config_informe',err);
  })
})


//[PUT]
routerConfigInforme.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Config_informe = await config_informe.findOne({ where: { id: req.body.id } })
  if (Config_informe) {
    // actualizar practica
    Config_informe.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar config_informe', err);
      })
  } else {
    console.log("No existe config_informe con id: ", req.query.id)
    res.sendStatus(404)
  }
})


module.exports = routerConfigInforme;