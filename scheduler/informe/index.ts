const { practica, modalidad, config_practica, config_informe, informe } = require('../../models');

export async function crear_informes(frecuencia_informes: string) {
    const lista_practicas = await practica.findAll({
        where: { estado: "En curso" },
        include: {
            model: modalidad,
            include: {
                model: config_practica,
                where: { frecuencia_informes: frecuencia_informes },
                include: {
                    model: config_informe,
                    where: { tipo_informe: "informe avance" }
                }
            }
        }
    });

    // por cada practica, crear un informe
    for (let i = 0; i < lista_practicas.length; i++) {
        let practica_aux = lista_practicas[i].dataValues;
        let modalidad_aux: any;
        let config_practica_aux: any;
        let config_informe_aux: any;

        //console.log("PRACTI AUX",practica_aux);

        if (practica_aux.modalidad == null) {
            continue;
        }
        modalidad_aux = practica_aux.modalidad.dataValues;
        //console.log("MODALI AUX",modalidad_aux);

        if (modalidad_aux.config_practica == null) {
            continue;
        }
        config_practica_aux = modalidad_aux.config_practica.dataValues;
        //console.log("CONFIG AUX",config_practica_aux);

        if (config_practica_aux.config_informes[0] == null) {
            continue;
        }
        config_informe_aux = config_practica_aux.config_informes[0].dataValues;
        //console.log("config INFORME AUX",config_informe_aux);

        await informe.create({
            id_practica: practica_aux.id,
            id_config_informe: config_informe_aux.id,
            horas_trabajadas: 0,
            fecha: new Date(),
        })
    }
}