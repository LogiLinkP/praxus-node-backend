export { };

const { Router } = require('express');
const routerEstudiante = new Router();
const sequelize = require('../../db');

routerEstudiante.get('/hola', (req: any, res: any) => {
    res.send("Hola desde estudiantes")
})

//[GET] para obtener un estudiante con su ID
routerEstudiante.get('/estudiante/:tagId', (req: any, res: any) => {
    console.log("Obteniendo estudiante de id: ", req.params.tagId)
    sequelize.estudiante.findOne({
        where: {
            id: req.params.tagId
        }
    })
        .then((resultados: any) => {
            console.log(resultados);
        }
        )
        .catch((err: any) => {
            console.log('Error al obtener estudiante', err);
        }
        )
})

//const estudiante = require('../../models/estudiante')(sequelize);

//const estudiante = sequelize.import('../../models/estudiante');

//const { estudiante } = require('../../models/estudiante');

//const estudiante = require('../../models');

//mostrar tabla estudiantes
routerEstudiante.get('/mostrartodos', (req:any, res:any) => {
    //res.send("Mostrando tabla estudiantes en consola")
    console.log("Mostrando tabla estudiantes en consola")
    sequelize.estudiante.findAll().then((resultados:any) => {
    //estudiante.findAll().then((resultados:any) => {  
      //console.log(resultados);
      res.send(resultados)
    }
    )
    .catch((err:any) => {
      //console.log('Error al mostrar estudiantes',err);
      res.send('Error al mostrar estudiantes',err)
    }
    )
})

//agregar un estudiante -CAMBIAR A POST-
routerEstudiante.get('/agregar', (req:any, res:any) => {
    res.send("Agregando estudiante a la base de datos")
    sequelize.estudiante.create({
    //estudiante.create({
      nombre: 'Vicente',
      rol: '201804585-3',
      id_usuario: 1
    })
    .then((resultados:any) => {
      console.log(resultados);
    }
    )
    .catch((err:any) => {
      console.log('Error al crear estudiante',err);
    }
    )
})

//mostrar estudiante con id 1
routerEstudiante.get('/obtener1estudiante', (req:any, res:any) => {
    res.send("Obteniendo estudiante con id 1")
    sequelize.estudiante.findOne({
      where: {
        id: 1
      }
    })
    .then((resultados:any) => {
      console.log(resultados);
    }
    )
    .catch((err:any) => {
      console.log('Error al obtener estudiante',err);
    }
    )
})

//actualizar nombre de estudiante con id 1 ¿PUT?
routerEstudiante.get('/actualizar1estudiante', (req:any, res:any) => {
    res.send("Actualizando estudiante con id 1")
    sequelize.estudiante.update({
        nombre: 'Vicente Balbontin'
    },
    {
        where: {
            id: 1
        }
    })
    .then((resultados:any) => {
        console.log(resultados);
    }
    )
    .catch((err:any) => {
        console.log('Error al actualizar estudiante',err);
    }
    )
})

//eliminar estudiante con id 1 ¿DELETE?
routerEstudiante.get('/eliminar1estudiante', (req:any, res:any) => {
    res.send("Eliminando estudiante con id 1")
    sequelize.estudiante.destroy({
      where: {
        id: 1
      }
    })
    .then((resultados:any) => {
      console.log(resultados);
    }
    )
    .catch((err:any) => {
      console.log('Error al eliminar estudiante',err);
    }
    )
  })

module.exports = routerEstudiante;