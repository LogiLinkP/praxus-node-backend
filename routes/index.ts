let { Router } = require('express');
const router = new Router();

// Rutas
router.use('/file', require('./files'));
router.use('/estudiante', require('./estudiantes'));
router.use('/similitud', require('./similitud'));
router.use('/practica', require('./practicas'))
router.use('/usuario', require('./usuario'))
//router.use('/informe', require('./informes'))
//router.use('/estudiante_cursa_practica', require('estudiante_cursa_practica'))
//router.use('/pregunta_supervisor', require('pregunta_supervisor'))
//router.use('/respuesta_informe', require('respuesta_informe'))

module.exports = router;