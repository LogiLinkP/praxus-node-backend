let { Router } = require('express');
const estudiantes = require('./estudiantes');
const files = require('./files');


const router = new Router();

// Rutas
router.use('/file', files);
router.use('/estudiantes', estudiantes);

module.exports = router;