export { };

const { estudiante, usuario, carrera, encargado } = require('../../models');
const { Router } = require('express');
const routerAdmin = new Router(); // /carrera

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

routerAdmin.post('/asignar-encargado', jsonParser, async (req: any, res: any) => {
    let { id_encargado, id_carrera } = req.body;
    if(id_carrera == -1){
      id_carrera = null;
    }
    try{
      let _carrera = await carrera.findOne({where: {id: id_carrera}});
      if(!_carrera){
          return res.status(500).json({message: "Carrera no encontrada"});
      }
      else{
          let _encargado = await encargado.findOne({where: {id: id_encargado}});
          if(!_encargado){
              return res.status(500).json({message: "Encargado no encontrado"});
          }
          else{
              await encargado.update({id_carrera: id_carrera}, {where: {id: id_encargado}});
              return res.status(200).json({message: "Encargado asignado exitosamente"});
          }
      }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Error de conexion"});
    }
    

});

routerAdmin.post('/eliminar-encargado', jsonParser, async (req: any, res: any) => {
    console.log(req.body.id);
    try {
        let data = await encargado.findOne({where: {id: req.body.id}})
        if (data) {
          console.log("Encargado existe")
          let user = await usuario.findOne({where: {id: data.id_usuario}})
          if (user) {
            console.log("Usuario existe")
            usuario.destroy({where: {id: data.id_usuario}})
            encargado.destroy({
              where: {
                id: req.body.id
              }
            })
            return res.status(200).json({message: "Encargado eliminado exitosamente"});
          }
        } else {
          return res.status(500).json({ message: "Encargado no encontrado" })
        }
      }
      catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error interno" });
      }
});

routerAdmin.get('/todos-encargados-carreras', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await carrera.findOne({
      where: {
        id: req.query.id
      }, include: [{model: encargado, include: [{model: usuario}]}]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerAdmin.post('/editar-carrera', jsonParser ,async (req: any, res: any) => {
  console.log(req.body)
  let { id_carrera, nombre_carrera, correos_admitidos } = req.body;
  try{
    let _carrera = await carrera.findOne({where: {id: id_carrera}});
    if(!_carrera){
        return res.status(500).json({message: "Carrera no encontrada"});
    }
    else{
        await carrera.update({nombre: nombre_carrera, correos_admitidos: correos_admitidos}, {where: {id: id_carrera}});
        return res.status(200).json({message: "Carrera editada exitosamente"});
    }
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message: "Error de conexion"});
  }
});

routerAdmin.post('/eliminar-carrera', jsonParser, async (req: any, res: any) => {
  console.log(req.body);
  try {
    let data = await carrera.findOne({where: {id: req.body.id}})
    if (data) {
      await encargado.update({id_carrera: null}, {where: {id_carrera: req.body.id}});
      await estudiante.update({id_carrera: null}, {where: {id_carrera: req.body.id}});
      carrera.destroy({where: {id: req.body.id}})
      return res.status(200).json({message: "Carrera eliminada exitosamente"});
    } else {
      return res.status(500).json({ message: "Carrera no encontrada" })
    }
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message: "Error de conexion"});
  }
});

module.exports = routerAdmin;