export { };

const { Router } = require('express');
const routerEstudiante = new Router();

routerEstudiante.get('/hola', (req: any, res: any) => {
    res.send("Hola desde estudiantes")
})

module.exports = routerEstudiante;