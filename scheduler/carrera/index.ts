const { carrera, respuesta_ramos, config_practica, modalidad, pregunta_supervisor, practica, respuesta_supervisor } = require('../../models');

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

export async function actualizar_promedio_aptitudes_carrera(){
    const lista_carreras = await carrera.findAll();
    //recorriendo carreras
    //console.log("Carreras: ", lista_carreras);
    for(let i=0; i<lista_carreras.length;i++){
        //console.log("Recorriendo carreras");
        let lista_config_practica_carrera = await config_practica.findAll({
            where: {
                id_carrera: lista_carreras[i].id
            }
        });
        //console.log("Configuraciones de Practica: ", lista_config_practica_carrera);
        let aux_nombre_aptitudes_carrera: string[] = [];
        let aux_eval_aptitudes_carrera: any[] = [];
        //recorriendo config_practica de la carrera
        for(let j=0; j<lista_config_practica_carrera.length;j++){
            console.log("Config_practica");
            if (lista_config_practica_carrera[j] != null) {
                let pregunta_evaluacion = await pregunta_supervisor.findOne({
                    where: {
                        tipo_respuesta: "evaluacion",
                        id_config_practica: lista_config_practica_carrera[j].id
                    }
                });

                if(pregunta_evaluacion != null){
                    let aptitudes_pregunta_evaluacion = pregunta_evaluacion.opciones.split(";;");
                    let lista_modalidades = await modalidad.findAll({
                        where: {
                            id_config_practica: lista_config_practica_carrera[j].id
                        }
                    });
                    //recorriendo modalidades de la config_practica
                    for(let k=0; k<lista_modalidades.length;k++){
                        let lista_practicas = await practica.findAll({
                            where: {
                                id_modalidad: lista_modalidades[k].id
                            }
                        });
                        console.log("Modalidad");
                        //recorriendo practicas de la modalidad
                        for(let l=0;l<lista_practicas.length;l++){

                            console.log("Practica");
        
                            let eval_aptitudes = await respuesta_supervisor.findOne({
                                where: {
                                    id_pregunta_supervisor: pregunta_evaluacion.id,
                                    id_practica: lista_practicas[l].id
                                }
                            });
                            //console.log("Evaluacion Aptitudes: ", eval_aptitudes);
                            if(eval_aptitudes != null){
                                let notas_pregunta_evaluacion = eval_aptitudes.respuesta.split(",");
                                console.log("Aptitudes Evaluadas: ", aptitudes_pregunta_evaluacion);
                                console.log("Nota Aptitudes: ", notas_pregunta_evaluacion);
                            }
                        }
                    }
                }

            }
            else{
                continue
            }
        }
    }
}