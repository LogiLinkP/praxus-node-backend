export { };

const { Router } = require('express');
const upload = require("../../middleware/upload_file");
const router = new Router();

router.post('/upload', upload.single("file"), (req: any, res: any) => {
    console.log(req.file);
    res.json({ message: "Archivo subido correctamente" });
});

module.exports = router;