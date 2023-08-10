export { };

const { Router } = require('express');
const sequelize = require('../../db');
const { usuario, supervisor, estudiante } = require('../../models');
const routerUsuario = new Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//[GET] mostrar todos los usuarios
routerUsuario.get('/todos', (req:any, res:any) => {
    console.log("Obteniendo todos los usuarios")
    sequelize.usuario.findAll().then((resultados:any) => {
      res.send(resultados)
    })
    .catch((err:any) => {
      console.log('Error al mostrar usuarios', err);
      res.send('Error al mostrar usuarios', err);
    })
})

//[GET] para obtener un usuario con su ID
routerUsuario.get('', (req: any, res: any) => {
    console.log("Obteniendo usuario de id: ", req.query.id)
    sequelize.usuario.findOne({
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
    const {correo, password, nombre, es_encargado, es_supervisor, es_estudiante, es_admin} = req.body;
    console.log("Request de creacion de usuario recibida");
    // hacer post a python backend
    sequelize.usuario.create({
        correo: correo,
        password: password,
        nombre: nombre,
        es_encargado: es_encargado,
        es_supervisor: es_supervisor,
        es_estudiante: es_estudiante,
        es_admin: es_admin

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
    sequelize.usuario.destroy({
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
  const usuario = await sequelize.usuario.findOne({ where: { id: req.body.id } })
  if (usuario){
    usuario.update(req.body)
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
  const {email,password}=req.body
    
    if(req.body.email.trim()===''||req.body.password.trim()===''){
        return res.status(400).send({msg:"email or password must not be empty"})
    
    }

    usuario.findOne({where: {correo: email}}).then((resultados:any)=>{
      if(resultados.length===0){
        return res.status(400).send({message: 'Error en usuario y contraseña'});
      }
      bcrypt.compare(password,resultados[0].password).then((checkout:any)=>{
        if(checkout===false){
          return res.status(400).send({message: 'Error en usuario y contraseña'});
        }
        const token = jwt.sign({id:resultados[0].id.toString()},process.env.SECRET_KEY,{expiresIn:'1h'})
        return res.status(200).send({message: 'Incio de sesion correcto', userdata: resultados[0],token});
      })
    }).catch((err:any)=>{
      if(err){
        return res.status(400).send({
            msg:err
        })
      }
    })

})

routerUsuario.post('/register',jsonParser, async (req:any, res:any) =>{
  let {email,password,cnfPwd,nombre,es_encargado,es_supervisor,es_estudiante,es_admin,extras} = req.body;
  const usuarioSend = {email,password,nombre,es_encargado,es_supervisor,es_estudiante,es_admin};
  let pwdHashed = '';
  if(!nombre){
    return res.status(400).send({message: 'Usuario vacio'});
  }
  
  if(!email){
    return res.status(400).send({message: 'Email incorrecto'});
  }

  if(!password||password.length < 6){
    return res.status(400).send({message: 'Contraseña pequeña'});
  }

  if(!cnfPwd||password!=cnfPwd){
    return res.status(400).send({message: 'Contraseñas no coinciden'});
  }

  usuario.findOne({where:{correo: email}}).then((resultados:any)=>{
    if(resultados.length!=0){
      return res.status(400).send({message: 'Email ya ocupado'});
    }else{
      bcrypt.hash(password,8).then((hash:any)=>{
        usuarioSend.password = hash;
        pwdHashed = hash;
      }).then(()=>{
        usuario.create({
          correo: email,
          password: pwdHashed,
          nombre: nombre,
          es_encargado: es_encargado,
          es_supervisor: es_supervisor,
          es_estudiante: es_estudiante,
          es_admin: es_admin
        }).then(()=>{
          usuario.findOne({where:{correo: email}}).then(()=>{
            if(es_encargado){
              return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
            }
            if(es_supervisor){
              supervisor.create({
                nombre: nombre,
                correo: email,
                carnet_rostro: null,
                es_correo_institucional: null
              }).then(()=>{
                return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
              }).catch((err:any)=>{
                if(err){
                  return res.status(400).send({message: err});
                }
              })
            }
            if(es_estudiante){
              estudiante.create({
                nombre_id_org: null,
                id_org: null,
                rut: null
              }).then(()=>{
                return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
              }).catch((err:any)=>{
                if(err){
                  return res.status(400).send({message: err});
                }
              })
            } 
            if(es_admin){
              return res.status(200).send({message: 'Inicio de sesion exitoso',userdata: usuarioSend});
            }
            else{
              return res.status(400).send({message: 'Usuario no identificado'});
            }
          }).catch((err:any)=>{
            if(err){
              return res.status(400).send({message: err});
            }
          })
        }).catch((err:any)=>{
          if(err){
            return res.status(400).send({message: err});
          }
        })
      })
    }
  }).catch((err:any)=>{
    if(err){
      return res.status(400).send({message: err});
    }
  })
})

routerUsuario.post('/logout',jsonParser,(req:any,res:any)=>{
  res.clearCookie("jwt");
  res.redirect("/");
})

module.exports = routerUsuario;