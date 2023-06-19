export { };

import { sendMail } from '../../utils/email';
import { upload } from '../../utils/uploadDocBd';
const { sequelize, practica } = require('../../models');

const { Router, json, urlencoded } = require('express');
// const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
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

router.post("/respuesta", async (req: any, res: any) => {
    try {
        if (typeof req.body !== "object") {
            res.status(406).json({ message: "Se requiere un objeto" });
            return;
        }
        if (!("respuestas" in req.body) || (typeof req.body.respuestas !== "object")) {
            res.status(406).json({ message: "se requieren respuestas en un objeto en el campo 'respuestas'" });
            return;
        }
        if (!("id_estudiante" in req.body) || !("id_config_practica" in req.body)) {
            res.status(406).json({ message: "Se requiere ingresar id_estudiante e id_config_practica" });
            return;
        }
        let key = `${Date.now()}-supervisor`;
        await practica.update({
            key_informe_supervisor: key,
            estado: "Listeilor"
        }, {
            where: {
                id_estudiante: req.body.id_estudiante,
                id_config_practica: req.body.id_config_practica,
            }
        });
        upload(`./tmp/${key}`, JSON.stringify(req.body.respuestas));
        res.status(200).json({ message: "Data recibida" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }
});


router.get("/respuesta", async (req: any, res: any) => {
    try {
        if (!("id_estudiante" in req.query) || !("id_config_practica" in req.query)) {
            res.status(406).json({ message: "Se requiere ingresar id_estudiante e id_config_practica" });
            return;
        }
        const _practica = await practica.findAll(
            {
                where: {
                    id_estudiante: req.query.id_estudiante,
                    id_config_practica: req.query.id_config_practica,
                }
            })
        console.log(_practica)
        // const files = fs.readdirSync("./tmp");
        // const data = files.map((file: any) => {
        //     let data = fs.readFileSync(`./tmp/${file}`, { encoding: "utf-8" });
        //     return JSON.parse(data);
        // });
        res.status(200).json({ _practica });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }
});
module.exports = router;