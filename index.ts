/*
import expres:anys, { Expres:anys, req:anyuest, res:anyponse } from 'expres:anys';
import dotenv from 'dotenv';

dotenv.config();

const app: Expres:anys = expres:anys();
const port = process.env.PORT;

app.get('/', (req:any: req:anyuest, res:any: res:anyponse) => {
  res:any.send('Expres:anys + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
*/

//export {};

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const sequelize = require('./database/db');

app.get('/', (req:any, res:any) => {
  res.send("GET req:anyuest Called")
})

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

//importar modelos
const estudiante = require('./dist/database/models/estudiante');
//const estudiante_cursa_practica = req:anyuire('./database/models/estudiante_cursa_practica');
//const usuario = req:anyuire('./database/models/usuario');
//const practica = req:anyuire('./database/models/practica');


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
app.get('/agregares:anytudiante', (req:any, res:any) => {
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
app.get('/obteneres:anytudiante', (req:any, res:any) => {
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
app.get('/actualizares:anytudiante', (req:any, res:any) => {
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
app.get('/eliminares:anytudiante', (req:any, res:any) => {
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


app.listen(PORT, function (err:any) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
  sequelize.sync({force: false}).then(() => { // sync() se conecta con las tablas existentes, sino las crea
    console.log('Database connected...');
  }).catch((err:any) => {
    console.log('Error: ', err);
  })
});