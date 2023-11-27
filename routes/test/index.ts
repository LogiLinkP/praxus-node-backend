export { };
import xlsx from 'node-xlsx';

const { informe } = require('../../models');
const { Router } = require('express');
const routerTest = new Router();
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

routerTest.post('/agregar_informes', jsonParser, async (req: any, res: any) => {
    try {
        const file = xlsx.parse(`tmp/bitacoras_practicas.xlsx`);
        // return res.json(file[0]["data"]);
        const { fecha_ini, id_practica_file, id_practica, id_config_informe } = req.query;
        let rows = [];
        let date_0 = new Date(fecha_ini + " 03:00:00");
        let idx = -1;
        for (let i = 0; i < file[0]["data"].length; i++) {
            if (file[0]["data"][i][0] == id_practica_file) {
                idx = i;
                break;
            }

        }
        console.log(1)

        let curr_row = file[0]["data"][idx];
        while (curr_row[0] == id_practica_file) {
            rows.push({
                id_practica, id_config_informe, horas_trabajadas: 0,
                fecha: new Date(date_0),
                key: { 1: curr_row[2] }
            });
            date_0.setDate(date_0.getDate() + 1);
            idx = (idx + 1) % file[0]["data"].length;
            curr_row = file[0]["data"][idx];
        }
        console.log(2)
        await informe.bulkCreate(rows);

        return res.json({ message: "filas agregadas" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Ha ocurrido un error interno" })
    }

});


module.exports = routerTest;