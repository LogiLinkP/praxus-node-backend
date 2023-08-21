export { };

import { sendMail } from '../../utils/email';
import { upload } from '../../utils/uploadDocBd';
const { sequelize, practica, informe } = require('../../models');
const axios = require('axios');
const { Router, json, urlencoded } = require('express');
// const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const crypto = require('crypto');
dotenv.config();

const router = new Router() // /supervisor
router.use(json());
router.use(urlencoded({ extended: true }));

router.post("/gen_token", (req: any, res: any) => {
    try {
        console.log("gen token");
        console.log(req.body);
        if ("correo" in req.body && "nom_sup" in req.body && "nom_estudiante" in req.body) {
            const { id_practica, correo, nom_sup, nom_estudiante } = req.body;

            const encrypt = (text:any) => {
                const algorithm = process.env.ENCRYPT_ALGORITHM;
                const key = process.env.ENCRYPT_SECRET_KEY;
                const iv = crypto.randomBytes(16)              
                const cipher = crypto.createCipheriv(algorithm, key, iv)              
                const encrypted = Buffer.concat([cipher.update(text), cipher.final()])              
                return {
                  iv: iv.toString('hex'),
                  content: encrypted.toString('hex')
                }
            }

            let encrypted_str = encrypt(req.body.id_practica.toString());

            // send the email with the encrypted id_practica
            sendMail(correo, `Revisión de práctica de ${nom_estudiante}`, "Para evaluar al practicante debe acceder a " + process.env.URL_FRONTEND + "/supervisor/evaluacion?token=" + encrypted_str.content + "&iv=" + encrypted_str.iv, "Revisión de práctica de " + nom_estudiante);
            //console.log("correo enviado correctamente");
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
        if (!("respuestas" in req.body) || !("evaluacion" in req.body) || (typeof req.body.respuestas !== "object")) {
            res.status(406).json({ message: "se requieren respuestas en un objeto en el campo 'respuestas' y 'evaluacion'" });
            return;
        }
        if (!("id_estudiante" in req.body) || !("id_config_practica" in req.body)) {
            res.status(406).json({ message: "Se requiere ingresar id_estudiante e id_config_practica" });
            return;
        }
        let key = `${Date.now()}-supervisor`;
        let respuesta_completa = "";
        for (let key in req.body.respuestas) {
            if (req.body.respuestas.hasOwnProperty(key)) {
                respuesta_completa += req.body.respuestas[key] + ". ";
            }
        }
        respuesta_completa = respuesta_completa.slice(0, -1);

        //consistencia evaluacion con informe supervisor
        let consistencia = await axios.post(`${process.env.URL_PYTHON_BACKEND}/nlp/consistencia_evaluacion_informe`, {
            texto: respuesta_completa,
            puntaje: +req.body.evaluacion,
            puntaje_min: 1,
            puntaje_max: 5
        });

        //consistencia informes estudiante
        const _practica = await practica.findOne({
            where: {
                id_estudiante: req.body.id_estudiante,
                id_config_practica: req.body.id_config_practica
            }
        });
        const _informe = await informe.findAll({
            id_practica: _practica.id
        });
        let informes = "";
        for (let inf of _informe) {
            informes += inf.key + ". ";
        }
        informes = informes.slice(0, -1);
        let consistencia_informe = await axios.post(`${process.env.URL_PYTHON_BACKEND}/nlp/consistencia_textos_keywords`, {
            texto1: informes,
            texto2: respuesta_completa
        });
        console.log(consistencia_informe.data);
        await practica.update({
            key_informe_supervisor: key,
            estado: "Evaluada",
            nota_evaluacion: +req.body.evaluacion,
            consistencia_nota: consistencia.data.evaluacion.similitud,
            interpretacion_nota: consistencia.data.interpretacion,
            consistencia_informe: consistencia_informe.data.score,
            interpretacion_informe: consistencia_informe.data.interpretacion
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