let { Router } = require('express');

const router = new Router();

// Rutas
router.use('/config_informe', require('./config_informe'));
router.use('/config_practica', require('./config_practica'));
router.use('/documento', require('./documento'));
router.use('/documento_extra', require('./documento_extra'));
router.use('/empresa', require('./empresa'));
router.use('/estudiante', require('./estudiante'));
router.use('/evaluacion', require('./evaluacion'));
router.use('/informe', require('./informe'));
router.use('/practica', require('./practica'));
router.use('/pregunta_encuesta_final', require('./pregunta_encuesta_final'));
router.use('/pregunta_informe', require('./pregunta_informe'));
router.use('/pregunta_supervisor', require('./pregunta_supervisor'));
router.use('/respuesta_encuesta_final', require('./respuesta_encuesta_final'));
router.use('/respuesta_supervisor', require('./respuesta_supervisor'));
router.use('/similitud', require('./similitud'));
router.use('/solicitud_documento', require('./solicitud_documento'));
router.use('/supervisor', require('./supervisor'));
router.use('/usuario', require('./usuario'));
router.use('/notificacion', require('./notificacion'));
router.use('/chat', require('./chat'));
router.use('/mensaje', require('./mensaje'));
router.use('/encargado', require('./encargado'));
router.use('/modalidad', require('./modalidad'));
router.use('/estadistica', require('./estadistica'));
router.use('/actualizacion_estadistica', require('./actualizacion_estadistica'));

module.exports = router;