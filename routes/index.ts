let { Router } = require('express');
const router = new Router();

const files = require('./files');
const similitud = require('./similitud');
const practicas = require('./practicas');
const estudiantes = require('./estudiantes');
const usuario = require('./usuario');
//const informes = require('./informes');
//const estudiante_cursa_practica = require('./estudiante_cursa_practica');
//const pregunta_supervisor = require('./pregunta_supervisor');
//const respuesta_informe = require('./respuesta_informe');

// Rutas
router.use('/file', files);
router.use('/estudiante', estudiantes);
router.use('/similitud', similitud);
router.use('/practica', practicas)
router.use('/usuario', usuario)
//router.use('/informe', informes)
//router.use('/estudiante_cursa_practica', estudiante_cursa_practica)
//router.use('/pregunta_supervisor', pregunta_supervisor)
//router.use('/respuesta_informe', respuesta_informe)

module.exports = router;