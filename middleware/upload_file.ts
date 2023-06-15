const multer = require('multer');

let path = "./tmp"
let storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: CallableFunction) => {
        cb(null, path);
    },
    filename: (req: Request, file: any, cb: CallableFunction) => {
        console.log(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
let uploadFile = multer({ storage: storage });
module.exports = uploadFile;
