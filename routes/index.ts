let { Router } = require('express');
const router = new Router();

// Rutas
router.use('/config_informe', require('./config_informe'))
router.use('/config_practica', require('./config_practica'))
router.use('/documento', require('./documento'));
router.use('/estudiante', require('./estudiante'));
router.use('/informe', require('./informe'))
router.use('/practica', require('./practica'));
router.use('/similitud', require('./similitud'));
router.use('/usuario', require('./usuario'))
//router.use('/pregunta_supervisor', require('./pregunta_supervisor'))
//router.use('/pregunta_informe', require('./pregunta_informe'))

module.exports = router;