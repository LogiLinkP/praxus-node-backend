export { };

const { Router } = require('express');
const routerPracticas = new Router();
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const sequelize = require('../../db');

// Import the axios library
const axios = require('axios');

//[GET] obtener todas las practicas
routerPracticas.get('/practica/:tagId', (req: any, res: any) => {
    console.log("Obteniendo practica con id: ", req.params.tagId)
    sequelize.practica.findOne({
        where: {
            id: req.params.tagId
        }
    })
        .then((resultados: any) => {
            console.log(resultados);
        }
        )
        .catch((err: any) => {
            console.log('Error al obtener practica', err);
        }
        )
})

//[POST] para recibir request de calculo de consistencia desde el front
routerPracticas.post('/crearPractica', jsonParser, (req: any, res: any) => {
    const {nombre, tipo_practica, num_informes, cantidad_horas, modalidad} = req.body;
    console.log("Request de creacion de practica recibida");
    console.log(req.body);
    // hacer post a python backend
    sequelize.practica.create({
        nombre: nombre,
        tipo_practica: tipo_practica,
        num_informes: num_informes,
        horas: cantidad_horas,
        modalidad: modalidad
    })
    .then((resultados:any) => {
        console.log(resultados);
    }
    )
    .catch((err:any) => {
        console.log('Error al crear practica',err);
    }
    )
    res.send("Practica creada");
})

module.exports = routerPracticas;