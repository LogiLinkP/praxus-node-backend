export { };

const { informe } = require('../../models');
const { Router } = require('express');
const routerTest = new Router();
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

routerTest.post('/agregar_informes', jsonParser, async (req: any, res: any) => {
    try {
        const { fecha_ini, cant_dias, id_practica, id_config_informe } = req.query;
        let rows = [];
        let date_0 = new Date(fecha_ini + " 03:00:00");
        for (let i = 0; i < +cant_dias; i++) {
            rows.push({
                id_practica, id_config_informe, horas_trabajadas: 0,
                fecha: new Date(date_0)
            });
            date_0.setDate(date_0.getDate() + 1)
        }
        await informe.bulkCreate(rows);
        return res.json({ message: "filas agregadas" });
    } catch (error) {
        console.log(error);
        return res.json({ message: "Ha ocurrido un error interno" })
    }

})


module.exports = routerTest;