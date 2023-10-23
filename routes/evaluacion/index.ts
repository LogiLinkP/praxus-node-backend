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