// import { fileTypeFromBuffer } from 'file-type';

const multer = require('multer');
const fs = require('fs');
const { filetypename } = require('magic-bytes.js');

const path = "./tmp";
const MAX_FILE_SIZE = 10 * 1000 * 1000; // 10MB porque MiB es de perdedores

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: CallableFunction) => {
        cb(null, path);
    },
    filename: (req: Request, file: any, cb: CallableFunction) => {
        console.log(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

function hayInterseccion(a: string[], b: string[]): boolean {
    for (let i = 0; i < a.length; i++) {
        if (b.includes(a[i]))
            return true;
    }
    return false;
}

export async function checkFileType(filePath: string, type: string[]): Promise<boolean> {
    if (!filePath || !type || type.length == 0) return false;

    let _filename = filePath.toLowerCase();
    // obtiene la extensión teniendo en cuenta que el nombre del archivo puede no tener puntos o partir con puntos
    let file_ext = _filename.slice((_filename.lastIndexOf(".") - 1 >>> 0) + 2)
    let _types = type.map((t: string) => t.toLowerCase());
    console.log(file_ext)
    console.log(_types)
    console.log(_types.includes(file_ext));
    if (!_types.includes(file_ext)) return false;

    let buffer = fs.readFileSync(filePath);
    return hayInterseccion(filetypename(buffer).map((t: string) => t.toLowerCase()), _types);
}

//funtcion to delete file given a path
export const deleteFile = (path: string) => {
    fs.unlink(path, (err: any) => {
        if (err) {
            console.error(err)
            return
        }
    })
}


export const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    }
});

