import { Router, Request, Response } from "express";
import { crear_doc } from "../../utils/crear_docx";

const routerCrearDocx: Router = Router();

routerCrearDocx.get('', async (req: Request, res: Response) => {
    try {
        crear_doc()
        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Se ha producido un error" })
    }

});

module.exports = routerCrearDocx;