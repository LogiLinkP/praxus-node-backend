export { };

import { sendMail } from '../../utils/email';

const { Router, json, urlencoded } = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const router = new Router() // /supervisor
router.use(json());
router.use(urlencoded());

router.post("/gen_token", (req: any, res: any) => {
    try {
        console.log(req.body);
        if ("correo" in req.body && "nom_sup" in req.body && "nom_estudiante" in req.body) {
            const { correo, nom_sup, nom_estudiante } = req.body;
            // const token = jwt.sign({ correo }, process.env.TOKEN_SECRET, { expiresIn: '7 days', algorithm: 'RS256' });
            // console.log(token);
            sendMail(correo, `Revisión de práctica de ${nom_estudiante}`, "Texto de ejemplo", nom_sup);
            res.status(200).json({ message: "Correo enviado" });
        } else {
            res.status(406).json({ message: "Se requiere ingresar correo, el nombre del supervisor y nombre del estudiante" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error interno" });
    }
});

router.post("/respuesta", (req: any, res: any) => {
    try {
        console.log(req.body);
        res.status(200).json({ message: "Data recibida" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }
});
module.exports = router;