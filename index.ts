require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const sequelize = require('./db');

//USAR ROUTES
app.use("/", require("./routes"));



/*
app.get('/', (req:any, res:any) => {
  res.send("GET request Called")
})
*/



/*
//Mostrar tablas en base de datos
app.get('/tablas', (req:any, res:any) => {
  res.send("Mostrando tablas en consola")
  sequelize.getQueryInterface().showAllSchemas().then((tableObj:any) => {
    console.log('// Tables in database','==========================');
    console.log(tableObj);
  })
  .catch((err:any) => {
    console.log('showAllSchemas ERROR',err);
  })
})

//mostrar tabla estudiantes en consola
app.get('/estudiantes', (req:any, res:any) => {
  res.send("Mostrando tabla estudiantes en consola")
  sequelize.estudiante.findAll().then((resultados:any) => {
    console.log(resultados);
  }
  )
  .catch((err:any) => {
    console.log('Error al mostrar estudiantes',err);
  }
  )
})
//aregar un estudiante
app.get('/agregarestudiante', (req:any, res:any) => {
  res.send("Agregando estudiante a la base de datos")
  sequelize.estudiante.create({
    nombre: 'Vicente',
    rol: '201804585-3'
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
*/



//agregar un user
/*
app.get('/agregaruser', (req:any, res:any) => {
  res.send("Agregando user a la base de datos")
  sequelize.user.create({
    firstName: 'Vicente',
    lastName: 'Balbontin' 
  })
  .then((resultados:any) => {
    console.log(resultados);
  }
  )
  .catch((err:any) => {
    console.log('Error al crear user',err);
  }
  )
})
*/

/*
const estudiante_cursa_practica = require('./database/models/estudiante_cursa_practica');
const estudiante = require('./database/models/estudiante');
const informe = require('./database/models/informe');
const practica = require('./database/models/practica');
const pregunta = require('./database/models/pregunta');
const respuesta_informe = require('./database/models/respuesta_informe');
const usuario = require('./database/models/usuario');
*/

//const user = require('./models/user');


/*
//Mostrar tabla estudiantes
app.get('/estudiantes', (req:any, res:any) => {
  res.send("Mostrando estudiantes en consola")

  estudiante.findAll().then((resultados:any) => {
    console.log(resultados);
  }
  )
  .catch((err:any) => {
    console.log('Error al mostrar estudiante',err);
  }
  )
})

//agregar un estudiante
app.get('/agregarestudiante', (req:any, res:any) => {
  res.send("Agregando estudiante a la base de datos")
  estudiante.create({
    nombre: 'Vicente',
    rol: '201804585-3',
    rut: '203000480-0',
    correo: 'vicente.balbontin@sansano.usm.cl'
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

//obtener estudiante con id 1
app.get('/obtenerestudiante', (req:any, res:any) => {
  res.send("Obteniendo estudiante con id 1")
  estudiante.findOne({
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

//actualizar nombre de estudiante con id 1
app.get('/actualizarestudiante', (req:any, res:any) => {
  res.send("Actualizando estudiante con id 1")
  estudiante.update({
    nombre: 'Juan Carlos'
  }, {
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

//eliminar estudiante con id 1
app.get('/eliminarestudiante', (req:any, res:any) => {
  res.send("Eliminando estudiante con id 1")
  estudiante.destroy({
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
*/

app.listen(PORT, function (err:any) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
  sequelize.sync({force: false}).then(() => { // sync() se conecta con las tablas existentes, sino las crea
    console.log('Database connected...');
  }).catch((err:any) => {
    console.log('Error: ', err);
  })
});