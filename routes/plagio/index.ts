export { }

const { plagio, informe, pregunta_informe } = require('../../models');
const { Router, json, urlencoded } = require('express');
const routerPlagio = new Router(); // /plagio

routerPlagio.use(json());
routerPlagio.use(urlencoded({ extended: true }));

routerPlagio.get('', async (req: any, res: any) => {
    try {
        const { id_practica, id_plagio } = req.query;
        console.log("id_practica:", id_practica);
        if ((!id_practica && !id_plagio) || (id_practica && id_plagio))
            return req.status(400).json({ message: "Debe especificar id de práctica o id de plagio, no ambas juntas ni ninguno" });
        let Data: any;
        if (id_practica) {
            Data = await plagio.findAll({ where: { id_practica: +id_practica } });
        } else {
            Data = await plagio.findAll({ where: { id_plagio: +id_plagio } });
        }
        console.log(Data)
        if (!Data || Data.length == 0)
            return res.status(400).json({ message: "No se pudo encontrar el elemento con id entregado" })

        return res.json(Data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }
});

routerPlagio.get('/informe', async (req: any, res: any) => {
    try {
        const { id_practica, id_plagio } = req.query;
        console.log("id_practica:", id_practica);
        if ((!id_practica && !id_plagio) || (id_practica && id_plagio))
            return req.status(400).json({ message: "Debe especificar id de práctica o id de plagio, no ambas juntas ni ninguno" });
        let Data: any;
        if (id_practica) {
            Data = await plagio.findAll({
                where: { id_practica: +id_practica },
                include: [{
                    model: informe,
                    required: true,
                    as: "informe_origen"
                }, {
                    model: informe,
                    required: true,
                    as: "informe_plagio"
                }, {
                    model: pregunta_informe,
                    required: true,
                    as: "pregunta_informe_origen"
                }, {
                    model: pregunta_informe,
                    required: true,
                    as: "pregunta_informe_plagio"
                }]
            });
        } else {
            Data = await plagio.findAll({ where: { id_plagio: +id_plagio } });
        }
        console.log(Data)
        if (!Data || Data.length == 0)
            return res.status(400).json({ message: "No se pudo encontrar el elemento con id entregado" })

        return res.json(Data);
    } catch (error) {
        console.log("--------ERROR-----------")
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }
});

module.exports = routerPlagio;