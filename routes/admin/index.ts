export { };

const { carrera, encargado } = require('../../models');
const { Router } = require('express');
const routerAdmin = new Router(); // /carrera

var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

routerAdmin.post('/asignar-encargado', jsonParser, async (req: any, res: any) => {
    
});

module.exports = routerAdmin;