export { };

const { documento, practica } = require("../../models");
const { Router } = require('express');
const upload = require("../../middleware/upload_file");
const router = new Router();

router.post('/upload', upload.single("file"), async (req: any, res: any) => {
    try {
        console.log(req.file);
        const _practica = await practica.findOne({
            where: {
                id_config_practica: 1,
                id_estudiante: +req.body.id_estudiante,
            }
        });
        const doc = await documento.create({
            id_practica: _practica.id,
            key: req.file.filename,
        });
        res.status(200).json({ message: "Archivo subido correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al subir el archivo" });
    }

});

router.get('/hola', (req: any, res: any) => {
    res.send("Hola desde files")
})

module.exports = router;