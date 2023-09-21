const { carrera, respuesta_ramos } = require('../../models');

export async function actualizar_ramos() {
    const carreras = await carrera.findAll();
    for (let i = 0; i < carreras.length; i++) {
        let array_respuesta_ramos = await respuesta_ramos.findAll({
            where: {
                id_carrera: carreras[i].id
            }
        });

        let ramos_aux: string[] = [];
        let votacion_ramos: number[] = [];

        for (let k = 0; k < array_respuesta_ramos.length; k++) {
            let ramos_seleccionados = array_respuesta_ramos[k].respuesta.split(";;");

            for (let j = 0; j < ramos_seleccionados.length; j++) {
                if (ramos_aux.includes(ramos_seleccionados[j])) {
                    votacion_ramos[ramos_aux.indexOf(ramos_seleccionados[j])] += 1;
                }
                else {
                    ramos_aux.push(ramos_seleccionados[j]);
                    votacion_ramos.push(1);
                }
            }
        }

        let estadistica_ramos: any[][] = [[]];

        for (let k = 0; k < votacion_ramos.length; k++) {
            estadistica_ramos[0].push(ramos_aux[k], Math.floor(votacion_ramos[k] * 100 / array_respuesta_ramos.length));
        }

        let objecto_estadistica_ramos = { "array": estadistica_ramos };

        //console.log(carreras[i].nombre)
        //console.log(objecto_estadistica_ramos);

        const Carrera = await carrera.findOne({ where: { id: carreras[i].id } })
        Carrera.update({
            estadistica_ramos: objecto_estadistica_ramos
        })
    }
}