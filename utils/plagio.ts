import { Op } from "sequelize";

const { informe, config_informe, pregunta_informe, plagio } = require("../../models");
const axios = require('axios');

interface Iposicion_plagio {
    id_informe: number,
    id_pregunta: number
}

interface Iplagio {
    propio: Iposicion_plagio,
    similar_a: Iposicion_plagio
}

interface Irespuesta_plagio {
    hay_plagio: boolean,
    status: number,
    message?: string,
    contenido_plagio?: Array<Iplagio>
}

export async function detectar_plagio(id_practica: number): Promise<Irespuesta_plagio> {
    const Informes_estudiante = await informe.findAll({
        where: {
            id_practica: id_practica,
            key: { [Op.ne]: null }
        },
        include: [
            {
                model: config_informe,
                required: true,
                include: [
                    {
                        model: pregunta_informe,
                        required: true,
                        where: { tipo_respuesta: 'abierta' }
                    }
                ]
            }
        ]
    });
    if (!Informes_estudiante)
        return {
            hay_plagio: false,
            status: 400,
            message: "Práctica no existe"
        } as Irespuesta_plagio;
    if (Informes_estudiante.length == 0)
        return {
            hay_plagio: false,
            status: 400,
            message: "No se encontraron informes"
        } as Irespuesta_plagio;

    const Informes_base = await informe.findAll({
        where: {
            id_practica: { [Op.ne]: id_practica },
            key: { [Op.ne]: null }
        },
        include: [
            {
                model: config_informe,
                required: true,
                include: [
                    {
                        model: pregunta_informe,
                        required: true,
                        where: { tipo_respuesta: 'abierta' }
                    }
                ]
            }
        ]
    });

    if (!Informes_base || Informes_base.length == 0)
        return {
            hay_plagio: false,
            status: 200,
            message: "No se encontraron informes"
        } as Irespuesta_plagio;

    let textos_base: Array<string> = [];
    let ids_base: Array<Iposicion_plagio> = []
    for (let inf of Informes_base) {
        const { pregunta_informes } = inf.config_informe;
        const { key } = inf;
        for (let pregunta of pregunta_informes) {
            textos_base.push(key[`${pregunta.id}`]);
            ids_base.push({ id_informe: inf.id, id_pregunta: pregunta.id });
        }
    }

    let textos_estudiante: Array<string> = [];
    let ids_estudiante: Array<Iposicion_plagio> = [];
    for (let inf of Informes_estudiante) {
        const { pregunta_informes } = inf.config_informe;
        const { key } = inf;
        for (let pregunta of pregunta_informes) {
            textos_estudiante.push(key[`${pregunta.id}`]);
            ids_estudiante.push({ id_informe: inf.id, id_pregunta: pregunta.id });
        }
    }

    const respuesta_py = await axios.post(`${process.env.URL_PYTHON_BACKEND}/nlp/calcular_similitud_textos`, {
        textos_base,
        textos: textos_estudiante
    });

    if (!respuesta_py || respuesta_py.status != 200 || !respuesta_py.data) {
        console.log(respuesta_py)
        return {
            hay_plagio: false,
            status: 500,
            message: "Se ha producido un error interno"
        } as Irespuesta_plagio;
    }

    let detecciones_plagios: Array<Iplagio> = [];
    const similitudes = respuesta_py.data;
    for (let idx_similitudes_texto_estudiante = 0; idx_similitudes_texto_estudiante < similitudes.length; idx_similitudes_texto_estudiante++) {
        for (let idx_similitudes_textos_base = 0; idx_similitudes_textos_base < similitudes[idx_similitudes_texto_estudiante].length; idx_similitudes_textos_base++) {
            const val = similitudes[idx_similitudes_texto_estudiante][idx_similitudes_textos_base]
            if (val > 0.5) {
                detecciones_plagios.push({
                    propio: ids_estudiante[idx_similitudes_texto_estudiante],
                    similar_a: ids_base[idx_similitudes_textos_base]
                })
            }
        }
    }
    if (detecciones_plagios.length == 0)
        return {
            hay_plagio: false,
            status: 200,
        } as Irespuesta_plagio;


    let rows_to_add: Array<Object> = [];
    for (let plagio_detectado of detecciones_plagios)
        rows_to_add.push({
            id_practica,
            id_informe_origen: plagio_detectado.similar_a.id_informe,
            id_pregunta_informe_origen: plagio_detectado.similar_a.id_pregunta,
            id_informe_plagio: plagio_detectado.propio.id_informe,
            id_pregunta_informe_plagio: plagio_detectado.propio.id_pregunta
        });

    await plagio.bulkCreate(rows_to_add);

    return {
        hay_plagio: true,
        status: 200,
        contenido_plagio: detecciones_plagios
    } as Irespuesta_plagio;

}