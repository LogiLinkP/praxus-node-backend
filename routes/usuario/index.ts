export { };

const { Router } = require('express');
const { usuario, supervisor, estudiante, encargado, actividad_usuarios, token_usuarios, practica, empresa, carrera } = require('../../models');
const routerUsuario = new Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { checkMail } = require("../../utils/pattern");
const {sendMail} = require("../../utils/email");

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
require('dotenv').config();

//[GET] mostrar todos los usuarios
routerUsuario.get('/todos', async (req: any, res: any) => {
  try {
    const data = await usuario.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

//[GET] para obtener un usuario con su ID
routerUsuario.get('', (req: any, res: any) => {
  usuario.findOne({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      res.send(resultados);
    })
    .catch((err: any) => {
      console.log('Error al obtener usuario', err);
    })
})

//[GET] para obtener un usuario con su encryted ID
routerUsuario.get('/confirmar_correo', async (req: any, res: any) => {
  try{
    const { token, iv } = req.query
    const algorithm = process.env.ENCRYPT_ALGORITHM;
    const key = process.env.ENCRYPT_SECRET_KEY;
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'))
    const decrypted = Buffer.concat([decipher.update(Buffer.from(token, 'hex')), decipher.final()])
    const decrypted_str = decrypted.toString()
    const _usuario = await usuario.findOne({
      where: {
        id: decrypted_str
      }
    })
    if(_usuario){
      await usuario.update({ activado: true }, { where: { id: decrypted_str } })
      return res.status(200).send({ message: 'Usuario encontrado', userdata: _usuario });
    }
    else{
      return res.status(400).send({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.log('Error al obtener usuario', err);
    return res.status(400).send({ message: 'Error al obtener usuario' });
  }
})

//[POST] Crear un usuario con los datos recibidos
routerUsuario.post('/crear', jsonParser, (req: any, res: any) => {
  const { correo, password, nombre, es_encargado, es_supervisor, es_estudiante, es_admin, config } = req.body;
  // hacer post a python backend
  usuario.create({
    correo: correo,
    password: password,
    nombre: nombre,
    es_encargado: es_encargado,
    es_supervisor: es_supervisor,
    es_estudiante: es_estudiante,
    es_admin: es_admin,
    config: config,
    activado: false
  })
    .then((resultados: any) => {
      res.send("Usuario creado");
    })
    .catch((err: any) => {
      console.log('Error al crear usuario', err);
    })
})

//[DELETE] Eliminar usuario con su ID
routerUsuario.delete('/eliminar', (req: any, res: any) => {
  usuario.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      res.sendStatus(200);
    })
    .catch((err: any) => {
      res.send(500);
      console.log('Error al eliminar usuario', err);
    })
})

//[PUT]
routerUsuario.put('/actualizar', jsonParser, async (req: any, res: any) => {
  const Usuario = await usuario.findOne({ where: { id: req.body.id } })
  if (Usuario) {
    Usuario.update(req.body)
      .then((resultados: any) => {
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar usuario', err);
      })
  } else {
    console.log("No existe usuario con id: ", req.query.id)
    res.sendStatus(404)
  }
})

routerUsuario.post('/login', jsonParser, async (req: any, res: any) => {
  const { email, password, useragent } = req.body

  if (req.body.email.trim() === '' || req.body.password.trim() === '') {
    return res.status(400).send({ message: "Email o password vacios" })

  }
  const resultados = await usuario.findOne({
    where: { correo: email, activado: true },
    include: [
      { model: estudiante },
      { model: encargado }
    ]
  })
  if (!resultados) {
    return res.status(400).send({ message: 'Credenciales incorrectas. Usuario o contraseña inválidos.' });
  }
  let checkout = await bcrypt.compare(password, resultados.password)
  if (checkout === false) {
    return res.status(400).send({ message: 'Credenciales incorrectas. Usuario o contraseña inválidos.' });
  }
  const token = jwt.sign({ id: resultados.id.toString() }, process.env.SECRET_KEY, { expiresIn: '1h' })
  let date = new Date();
  let now = date.toLocaleDateString();

  try {
    await actividad_usuarios.create({
      id_usuario: resultados.id,
      accion: "Inicio sesion",
      fecha: date,
      useragent: useragent
    })
    //por comprobar si es valido hacer esto
    await token_usuarios.create({
      id_usuario: resultados.id_usuario,
      token: token
    })
    return res.status(200).send({ message: 'Inicio de sesion correcto', userdata: resultados, token });
  } catch (err) {
    console.error(err)
    return res.status(400).send({ message: 'Error al iniciar sesion' });
  }
})


routerUsuario.put('/estado_config', jsonParser, async (req: any, res: any) => {
  const Usuario = await usuario.findOne({ where: { id: req.body.id } })
  if (Usuario) {
    const Usuario_Update = usuario.update({ config: req.body.estado }, { where: { id: req.body.id } })
      .then((resultados: any) => {
        return res.status(200).send({ message: 'Estado cambiado con éxito', userdata: Usuario });
      })
      .catch((err: any) => {
        res.send(500)
        console.log('Error al actualizar usuario', err);
      })
  } else {
    console.log("No existe usuario con id: ", req.query.id)
    res.sendStatus(404)
  }
})

routerUsuario.post('/register', jsonParser, async (req: any, res: any) => {
  let { email, password, cnfPwd, nombre, es_encargado, es_supervisor, es_estudiante, es_admin, extras } = req.body;
  let RUT: any;
  let id_carrera;

  if (es_estudiante) {
    

  }
  const usuarioSend = { email, password, nombre, es_encargado, es_supervisor, es_estudiante, es_admin };
  let pwdHashed = '';

  if (!cnfPwd || password != cnfPwd) {
    return res.status(400).send({ message: 'Contraseñas no coinciden' });
  }
  // Verificar si correo ya existe
  const data = await usuario.findOne({ where: { correo: email, activado: true} })
  if (data != null) {
    return res.status(400).send({ message: 'Correo ya ocupado, intente con otro correo.' });
  }
  else {
    let hash = await bcrypt.hash(password, 8)
    usuarioSend.password = hash;
    pwdHashed = hash;
    try {
      let _usuario = await usuario.create({
        correo: email,
        password: pwdHashed,
        nombre: nombre,
        es_encargado: es_encargado,
        es_supervisor: es_supervisor,
        es_estudiante: es_estudiante,
        es_admin: es_admin,
        config: null,
        activado: false
      })
      if (_usuario.es_encargado) {
        try {
          let _encargado = await encargado.findOne({
            where: { id_usuario: _usuario.id }
          })
          if (_encargado != null) {
            return res.status(400).send({ message: 'Encargado ya existe' });
          }
          else {
            await encargado.create({ id_usuario: _usuario.id, id_carrera: null, practica_pendiente: null });
            await usuario.update({ activado: true }, { where: { id: _usuario.id } })
            return res.status(200).send({ message: 'Creacion de usuario correcta', userdata: usuarioSend });
          }
        }
        catch (err) {
          return res.status(400).send({ message: 'Error al crear usuario' });
        }

      }
      if (_usuario.es_supervisor) {
        let trabajador = await supervisor.findAll({ where: { correo: email } })
        if (trabajador != null && trabajador.correo == email) {
          return res.status(400).send({ message: 'Correo ya ocupado, intente con otro correo.' });
        }
        else {
          supervisor.update({ id_usuario: _usuario.id }, { where: { correo: email } })
          return res.status(200).send({ message: 'Creacion de usuario correcta', userdata: usuarioSend });
        }
      }
      if (_usuario.es_estudiante) {
        RUT = extras.RUT;
        id_carrera = extras.id_carrera;
        try {
          let dominios = await carrera.findAll();
          if (!checkMail(email, dominios)) {
            return res.status(400).json({ message: 'Dominio de correo no valido' });
          }
        }
        catch (err) {
          return res.status(400).json({ message: 'Error al consultar carreras' });
        }
        try {
          
          await estudiante.create({
            id_usuario: _usuario.id,
            nombre_id_org: null,
            id_org: null,
            rut: RUT,
            id_carrera: id_carrera

          })

          // enviar correo de confirmacion, con un link que contiene el id del usuario recién creado encriptado en la url
          const encrypt = (text: any) => {
            const algorithm = process.env.ENCRYPT_ALGORITHM;
            const key = process.env.ENCRYPT_SECRET_KEY;
            const iv = crypto.randomBytes(16)
            const cipher = crypto.createCipheriv(algorithm, key, iv)
            const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
            return {
              iv: iv.toString('hex'),
              content: encrypted.toString('hex')
            }
          }
    
          let encrypted_str = encrypt(_usuario.id.toString())

          sendMail(email, `Registro de usario en plataforma Praxus`, 
                  "Para confirmar su registro en Praxus debe ingresar al siguiente link " + process.env.URL_FRONTEND + "/usuario/confirmacion?token=" + encrypted_str.content + "&iv=" + encrypted_str.iv, 
                  `Registro de usario en plataforma Praxus`);

          return res.status(200).send({ message: 'Registro exitoso', userdata: usuarioSend });
        }
        catch (err) {
          return res.status(400).send({ message: 'Error al crear usuario' });
        }
      }

    }
    catch (err) {
      return res.status(400).send({ message: 'Error al crear usuario' });
    }
  }
})

routerUsuario.post('/logout', jsonParser, (req: any, res: any) => {
  res.clearCookie("jwt");
  return res.status(200).send({ message: 'Cierre de sesion exitoso' });
})

routerUsuario.post('/resetpwd', jsonParser, async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'Ingrese email' });
  }
  const _usuario = await usuario.findOne({ where: { correo: email } })
  if (!_usuario) {
    return res.status(400).send({ message: 'Usuario no encontrado' });
  }
  var new_token = crypto.randomBytes(32).toString('hex');


})

routerUsuario.post('/crear_supervisor', jsonParser, async (req: any, res: any) => {
  let { email, password, cnfPwd, nombre } = req.body;
  const usuarioSend = { email, password, nombre };
  let pwdHashed = '';
  if (!cnfPwd || password != cnfPwd) {
    return res.status(400).send({ message: 'Contraseñas no coinciden' });
  }
  try {
    let query = await usuario.findOne({ where: { correo: email, activado: true } })
    if (query != null) {
      return res.status(400).send({ message: 'Correo ya ocupado, intente con otro correo.' });
    }
    else {
      let hash = await bcrypt.hash(password, 8)
      usuarioSend.password = hash;
      pwdHashed = hash;
      let _usuario = await usuario.create({
        correo: email,
        password: pwdHashed,
        nombre: nombre,
        es_encargado: false,
        es_supervisor: true,
        es_estudiante: false,
        es_admin: false,
        config: null,
        activado: true
      })

      let trabajador = await supervisor.findAll({ where: { correo: email } })
      if (trabajador != null && trabajador.correo == email) {
        return res.status(400).send({ message: 'Correo ya ocupado, intente con otro correo.' });
      }
      else {
        supervisor.update({ id_usuario: _usuario.id }, { where: { correo: email } })
      }
    }
  }
  catch (err) {
    return res.status(400).send({ message: 'Error al crear supervisor' });
  }
})

routerUsuario.post('/estudiantes_revisados', jsonParser, async (req: any, res: any) => {
  let { id_usuario } = req.body;
  let nombre = '';
  let correo = '';
  let rut_empresa = '';
  let nombre_empresa = '';
  let estado = '';
  let inicio = '';
  let fin = '';
  let lista = [];
  try {
    let query = await supervisor.findOne({ where: { id_usuario: id_usuario } })
    let query2 = await practica.findAll({ where: { id_supervisor: query.id } })
    for (let i = 0; i < query2.length; i++) {
      let query3 = await estudiante.findAll({ where: { id: query2[i].id_estudiante } })
      for (let j = 0; j < query3.length; j++) {
        let response = await usuario.findOne({ where: { id: query3[j].id_usuario } })
        let enterprise = await empresa.findOne({ where: { id: query2[i].id_empresa } })
        nombre = response.nombre;
        correo = response.correo;
        estado = query2[i].estado
        rut_empresa = enterprise.rut_empresa;
        nombre_empresa = enterprise.nombre_empresa
        inicio = query2[i].fecha_inicio;
        fin = query2[i].fecha_termino;
        let data = { nombre, correo, estado, rut_empresa, nombre_empresa, inicio, fin }
        lista.push(data)
      }
    }
    if (lista.length > 0) {
      return res.status(200).send({ message: 'Estudiantes obtenidos', body: lista });
    }
    else {
      return res.status(400).send({ message: 'Error al obtener estudiantes2' });
    }
  }
  catch (err) {
    return res.status(400).send({ message: 'Error al obtener estudiantes1' });
  }
})

module.exports = routerUsuario;