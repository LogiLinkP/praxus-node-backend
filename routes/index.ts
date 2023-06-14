let { Router } = require('express');
const files = require('./files');

const router = new Router();

// Rutas
router.use('/file', files);
module.exports = router;