export { };

const { usuario, carrera, encargado } = require('../../models');
const { Router } = require('express');
const routerAdmin = new Router(); // /carrera

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

routerAdmin.post('/asignar-encargado', jsonParser, async (req: any, res: any) => {
    let lista = [];
    let { pares } = req.body;
    console.log(pares);
    if(pares.length == 1){
        try{
            let _carrera = await carrera.findOne({where: {id: pares[0].id_carrera}});
            if(!_carrera){
                return res.status(500).send({message: "Carrera no encontrada"});
            }
            else{
                let _encargado = await encargado.findOne({where: {id: pares[0].id_encargado}});
                if(!_encargado){
                    return res.status(500).send({message: "Encargado no encontrado"});
                }
                else{
                    await encargado.update({id_carrera: pares[0].id_carrera}, {where: {id: pares[0].id_encargado}});
                    return res.status(200).send({message: "Encargado asignado exitosamente"});
                }
            }
        }
        catch(error){
            console.log(error);
            return res.status(500).send({message: "Error de conexion"});
        }
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
            return res.sendStatus(200);
          }
        } else {
          return res.status(500).send({ message: "Encargado no encontrado" })
        }
      }
      catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error interno" });
      }
});

module.exports = routerAdmin;