let { Router } = require('express');
const estudiantes = require('./estudiantes');
const files = require('./files');

const router = new Router();

router.get('/', (req:any, res:any) => {
    res.send("GET request Called")
  })

// Rutas
router.use('/file', files);
router.use('/estudiante', estudiantes);

module.exports = router;