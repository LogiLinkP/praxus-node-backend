const { config_practica, pregunta_encuesta_final, estadistica, respuesta_encuesta_final, modalidad, practica } = require('../../models');

export async function actualizar_encuesta_practica() {
    const lista_config_practicas = await config_practica.findAll();
    //console.log(lista_config_practicas);

    //recorriendo cada config practica
    for (let i = 0; i < lista_config_practicas.length; i++) {
        console.log(lista_config_practicas[i].nombre);
        let lista_preguntas_encuesta = await pregunta_encuesta_final.findAll({
            where: {
                id_config_practica: lista_config_practicas[i].id
            }
        });
        //console.log(lista_preguntas_encuesta);

        //let estadisticas_config_practica_aux = [];
        //borrando estadisticas actuales de cada config practica
        await estadistica.destroy({
            where: {
                id_config_practica: lista_config_practicas[i].id
            }
        });

        //recorriendo cada pregunta de la config practica
        for (let j = 0; j < lista_preguntas_encuesta.length; j++) {
            //console.log("pregunta");
            //console.log(lista_preguntas_encuesta[j].enunciado);

            let opciones_aux = lista_preguntas_encuesta[j].opciones.split(";;");
            let cantidad_opcion_marcada = new Array(opciones_aux.length).fill(0);

            //console.log("opciones");
            //console.log(opciones_aux);

            let lista_respuestas_encuesta = await respuesta_encuesta_final.findAll({
                where: {
                    id_pregunta_encuesta_final: lista_preguntas_encuesta[j].id
                }
            });
            //console.log("respuestas")
            //console.log(lista_respuestas_encuesta);

            //recorriendo respuestas de la pregunta
            for (let k = 0; k < lista_respuestas_encuesta.length; k++) {
                let respuesta_aux = lista_respuestas_encuesta[k].respuesta.split(",");
                //console.log(respuesta_aux);
                //recorriendo opciones de la pregunta
                for (let l = 0; l < respuesta_aux.length; l++) {
                    if (respuesta_aux[l] == 1) {
                        cantidad_opcion_marcada[l] += 1;
                    }
                }
            }

            //console.log("cantidad opcion marcada");
            //console.log(cantidad_opcion_marcada);

            let estadistica_pregunta_aux = [];

            estadistica_pregunta_aux.push(lista_config_practicas[i].id, lista_preguntas_encuesta[j].enunciado);

            for (let k = 0; k < cantidad_opcion_marcada.length; k++) {
                estadistica_pregunta_aux.push(opciones_aux[k])
                if (!(cantidad_opcion_marcada[k] * 100 / lista_respuestas_encuesta.length)) {
                    estadistica_pregunta_aux.push(0);
                }
                else {
                    estadistica_pregunta_aux.push(Math.floor(cantidad_opcion_marcada[k] * 100 / lista_respuestas_encuesta.length));
                }
            }

            //console.log("estadistica pregunta");
            //console.log(estadistica_pregunta_aux);

            //agregar a tabla estadistica con formato correspondiente

            estadistica.create({
                id_config_practica: estadistica_pregunta_aux[0],
                pregunta_respuestas: { "array": estadistica_pregunta_aux }
            })
        }
    }
}

export async function actualizar_sueldo_promedio_config_practica() {
    const lista_config_practicas = await config_practica.findAll();
    //console.log(lista_config_practicas);
    for (let i = 0; i < lista_config_practicas.length; i++){
        let suma_sueldos = 0;
        let cantidad_practicas = 0;
        let lista_modalidades = await modalidad.findAll({
            where: {
                id_config_practica: lista_config_practicas[i].id
            }
        });
        for (let j = 0; j < lista_modalidades.length; j++){
            let practicas_modalidad = await practica.findAll({
                where: {
                    id_modalidad: lista_modalidades[j].id
                }
            });
            for (let k = 0; k < practicas_modalidad.length; k++){
                if (practicas_modalidad[k].sueldo){
                    suma_sueldos += practicas_modalidad[k].sueldo;
                    cantidad_practicas += 1;
                }
            }
        }
        if (cantidad_practicas != 0){
            let sueldo_promedio = suma_sueldos / cantidad_practicas;
            const Config_practica = await config_practica.findOne({ where: { id: lista_config_practicas[i].id } })
            Config_practica.update({
                sueldo_promedio: sueldo_promedio
            })
        }
    }
}