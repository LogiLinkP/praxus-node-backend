export { };

const { Router } = require('express');
const { usuario, supervisor, estudiante, actividad_usuario, token_usuario } = require('../../models');
const routerUsuario = new Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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
    console.log("Obteniendo usuario de id: ", req.query.id)
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

//[POST] Crear un usuario con los datos recibidos
routerUsuario.post('/crear', jsonParser, (req: any, res: any) => {
    const {correo, password, nombre, es_encargado, es_supervisor, es_estudiante, es_admin, config} = req.body;
    console.log("Request de creacion de usuario recibida");
    // hacer post a python backend
    usuario.create({
        correo: correo,
        password: password,
        nombre: nombre,
        es_encargado: es_encargado,
        es_supervisor: es_supervisor,
        es_estudiante: es_estudiante,
        es_admin: es_admin,
        config: config

    })
    .then((resultados:any) => {
        console.log(resultados);
        res.send("Usuario creado");
    })
    .catch((err:any) => {
        console.log('Error al crear usuario',err);
    })
})

//[DELETE] Eliminar usuario con su ID
routerUsuario.delete('/eliminar', (req:any, res:any) => {
    console.log("Eliminando usuario con id: ", req.query.id)
    usuario.destroy({
      where: {
        id: req.query.id
      }
    })
    .then((resultados:any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err:any) => {
      res.send(500);
      console.log('Error al eliminar usuario', err);
    })
})

//[PUT]
routerUsuario.put('/actualizar', jsonParser, async (req:any, res:any) => {
  const Usuario = await usuario.findOne({ where: { id: req.body.id } })
  if (Usuario){
    Usuario.update(req.body)
    .then((resultados:any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err:any) => {
      res.send(500)
      console.log('Error al actualizar usuario', err);
    })
  } else {
      console.log("No existe usuario con id: ", req.query.id)
      res.sendStatus(404)
  }
})

routerUsuario.post('/login',jsonParser, async (req:any, res:any) => {
  const {email,password,useragent}=req.body

  console.log(typeof password)
    
  if(req.body.email.trim()===''||req.body.password.trim()===''){
      return res.status(400).send({message:"Email o password vacios"})
  
  }
  const resultados = await usuario.findOne({where: {correo: email}})
  if(resultados.length===0){
    return res.status(400).send({message: 'Error en usuario y contraseña'});
  }
  let checkout = await bcrypt.compare(password,resultados.password)
  if(checkout===false){
    return res.status(400).send({message: 'Error en usuario y contraseña'});
  }
  const token = jwt.sign({id:resultados.id.toString()},process.env.SECRET_KEY,{expiresIn:'1h'})
  let date = new Date();
  let now = date.toLocaleDateString();
  try{
    await actividad_usuario.create({
      id_usuario: resultados.id_usuario,
      accion: "Inicio sesion",
      fecha: now,
      useragent: useragent
    })
    //por comprobar si es valido hacer esto
    await token_usuario.create({
      id_usuario: resultados.id_usuario,
      token: token
    })
    return res.status(200).send({message: 'Inicio de sesion correcto', userdata: resultados,token});
  }catch(err){
      return res.status(400).send({message: 'Error al iniciar sesion'});
  }
  

})

routerUsuario.post('/register',jsonParser, async (req:any, res:any) =>{
  let {email,password,cnfPwd,nombre,es_encargado,es_supervisor,es_estudiante,es_admin,extras} = req.body;
  let RUT:any ;
  if(es_estudiante){
    RUT = extras.RUT;
  }
  const usuarioSend = {email,password,nombre,es_encargado,es_supervisor,es_estudiante,es_admin};
  let pwdHashed = '';

  if(!cnfPwd||password!=cnfPwd){
    return res.status(400).send({message: 'Contraseñas no coinciden'});
  }
  console.log(email);
  // Verifico si correo ya se ocu
  const data = await usuario.findOne({where:{correo: email}})
  if(data!=null){
    return res.status(400).send({message: 'Email ya ocupado'});
  }
  else{
    console.log("1")
    let hash = await bcrypt.hash(password,8)
    usuarioSend.password = hash;
    pwdHashed = hash;
    try{
      let _usuario = await usuario.create({
        correo: email,
        password: pwdHashed,
        nombre: nombre,
        es_encargado: es_encargado,
        es_supervisor: es_supervisor,
        es_estudiante: es_estudiante,
        es_admin: es_admin,
        config: null
      })

      console.log(_usuario)
      if(_usuario.es_encargado){
        return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
      }
      console.log(1)
      if(_usuario.es_supervisor){
        try{
          await supervisor.create({
            nombre: nombre,
            correo: email,
            carnet_rostro: null,
            es_correo_institucional: null
          })
          return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
        }
        catch(err){
          return res.status(400).send({message: 'Error al crear super'});
        }
      }
      if(_usuario.es_estudiante){
        try{
          await estudiante.create({
            id_usuario: _usuario.id,
            nombre_id_org: null,
            id_org: null,
            rut: RUT
          })
          return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
        }
        catch(err){
          return res.status(400).send({message: 'Error al crear est'});
        }
      }
    
    }
    catch(err){
      return res.status(400).send({message: 'Error al crear usuario'});
    }}
})

routerUsuario.post('/logout',jsonParser,(req:any,res:any)=>{
  res.clearCookie("jwt");
  return res.status(200).send({message: 'Cierre de sesion exitoso'});
})

routerUsuario.post('/resetpwd', jsonParser,async (req: any, res:any)=>{
  const {email} = req.body;
  if(!email){
    return res.status(400).send({message: 'Ingrese email'});
  }
  const _usuario = await usuario.findOne({where: {correo: email}})
  if(!_usuario){
    return res.status(400).send({message: 'Usuario no encontrado'});
  }
  var new_token = crypto.randomBytes(32).toString('hex');

  
})

module.exports = routerUsuario;