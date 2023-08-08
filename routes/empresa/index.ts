export { };

const { Router } = require('express');
const sequelize = require('../../db');
const routerEmpresa = new Router();

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerEmpresa.get('', (req: any, res: any) => {
    console.log("Obteniendo empresa con id: ", req.query.id)
    sequelize.empresa.findOne({
        where: {
            id: req.query.id
        }
    })
    .then((resultados: any) => {
        res.send(resultados);
    })
    .catch((err: any) => {
        console.log('Error al obtener empresa', err);
    })
})

//[GET] mostrar todos
routerEmpresa.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos las empresas")
    sequelize.empresa.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar empresa', err);
      res.send('Error al mostrar empresa', err)
    })
})

//[DELETE] Eliminar
routerEmpresa.delete('/eliminar', (req:any, res:any) => {
  console.log("Eliminando empresa con id: ", req.query.id)
  sequelize.empresa.destroy({
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
    console.log('Error al eliminar de empresa', err);
  })
})

//[POST] Crear uno
routerEmpresa.post('/crear', jsonParser, (req: any, res: any) => {
  const {nombre_empresa, rut_empresa, empresa_verificada, dominios_empresa} = req.body;
  console.log("Request de empresa");
  sequelize.empresa.create({
    nombre_empresa: nombre_empresa,
    rut_empresa: rut_empresa,
    empresa_verificada: empresa_verificada,
    dominios_empresa: dominios_empresa
  })
  .then((resultados:any) => {
      console.log(resultados);
      res.send("empresa creado");
  })
  .catch((err:any) => {
      console.log('Error al crear empresa',err);
  })
})


//[PUT]
routerEmpresa.put('/actualizar', jsonParser, async (req:any, res:any) => {
    const empresa = await sequelize.empresa.findOne({ where: { id: req.body.id } })
    if (empresa){
      empresa.update(req.body)
      .then((resultados:any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err:any) => {
        res.send(500)
        console.log('Error al actualizar empresa', err);
      })
    } else {
        console.log("No existe empresa con id: ", req.query.id)
        res.sendStatus(404)
    }
})

module.exports = routerEmpresa;