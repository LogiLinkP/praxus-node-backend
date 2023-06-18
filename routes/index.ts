let { Router } = require('express');
const estudiantes = require('./estudiantes');
const files = require('./files');
const similitud = require('./similitud');
const supervisor = require('./supervisor');

const router = new Router();

router.get('/', (req: any, res: any) => {
  res.send("GET request Called")
})

// Rutas
router.use('/file', files);
router.use('/estudiante', estudiantes);
router.use('/similitud', similitud);
router.use('/supervisor', supervisor);

module.exports = router;