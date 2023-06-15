export { };

const { Router } = require('express');
const upload = require("../../middleware/upload_file");
const router = new Router();

router.post('/upload', upload.single("file"), (req: any, res: any) => {
    console.log(req.file);
    res.send("Archivo subido correctamente");
});

router.get('/hola', (req: any, res: any) => {
    res.send("Hola desde files")
})

module.exports = router;