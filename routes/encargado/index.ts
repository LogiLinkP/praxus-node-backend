export { };

const { encargado, usuario, estudiante, practica } = require('../../models');
const { Router } = require('express');
const sequelize = require('../../db');
const routerEncargado = new Router(); // /encargado

//Librerias para creacion de encargado

const {sendMail} = require("../../utils/email");
const crypto = require("crypto");

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerEncargado.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await encargado.findOne({
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


//[GET] para obtener un encargado con su ID de usuario
routerEncargado.get('/usuario', async (req: any, res: any) => {
  try {
    if (!("id_usuario" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id_usuario" });
      return;
    }
    const data = await encargado.findOne({
      where: {
        id_usuario: req.query.id_usuario
      },
      include: [{
        model: usuario
      }]
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});
//[GET] mostrar todos
routerEncargado.get('/todos', async (req: any, res: any) => {
  let lista = [];
  try {
    let data = await encargado.findAll();
    for (let i = 0; i < data.length; i++) {
      let user = await usuario.findOne({ where: { id: data[i].id_usuario } })
      let nombre = user.nombre
      let correo = user.correo
      let id_encargado = data[i].id
      let id_usuario = data[i].id_usuario
      let id_carrera = data[i].id_carrera
      if (user) {
        lista.push({id: id_encargado,id_usuario: id_usuario, id_carrera: id_carrera, nombre: nombre, correo: correo })
      }
    }
    return res.status(200).send({data: lista}); 
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerEncargado.delete('/eliminar', async (req: any, res: any) => {
  console.log("Eliminando encargado con id: ", req.query.id)
  try {
    let data = await encargado.findOne({where: {id: req.query.id}})
    if (data) {
      console.log("Encargado existe")
      let user = await usuario.findOne({where: {id: data.id_usuario}})
      if (user) {
        console.log("Usuario existe")
        usuario.destroy({where: {id: data.id_usuario}})
        encargado.destroy({
          where: {
            id: req.query.id
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
})
//[POST] Crear uno
routerEncargado.post('/crear', jsonParser, (req: any, res: any) => {
  const { id_usuario, id_carrera, practica_pendiente } = req.body;
  console.log("Request de encargado");
  encargado.create({
    id_usuario: id_usuario,
    id_carrera: id_carrera,
    practica_pendiente: practica_pendiente
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.send("encargado creada");
    })
    .catch((err: any) => {
      console.log('Error al crear encargado', err);
    })
})


//[PUT]
routerEncargado.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Encargado = await encargado.findOne({ where: { id: req.body.id } })
  if (Encargado) {
    // actualizar practica
    Encargado.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar encargado', err);
      })
  } else {
    console.log("No existe encargado con id: ", req.query.id)
    res.sendStatus(404)
  }
})

//[GET] obtener todos los estudiantes dado un encargado
routerEncargado.get('/estudiantes', async (req: any, res: any) => {
  try {
    console.log(req.query)
    if (!("id_encargado" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id_encargado" });
      return;
    }
    console.log(1)
    const data = await encargado.findAll({
      where: {
        id: req.query.id_encargado
      },
      include: [{
        model: practica, include: [{ model: estudiante, include: [{ model: usuario }] }]
      }]
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

routerEncargado.post('/crear-encargado', jsonParser, async (req: any, res: any) => {
  let { email } = req.body;
  console.log(1)
  try {
    let token = crypto.randomBytes(32).toString("hex");
    console.log(2)
    const link = `${process.env.URL_FRONTEND}/encargado/registro/${token}`;
    console.log(3)
    const texto = "Para registrarse en la plataforma Praxus debe ingresar al siguiente enlace: " + link;
    sendMail(email, "Registro de encargado", texto);
    console.log(4)
    return res.status(200).send({ message: "Correo enviado" });
  }
  catch (err) { 
    console.log(err);
    return res.status(500).send({ message: "Error interno" });
  }
});

module.exports = routerEncargado;