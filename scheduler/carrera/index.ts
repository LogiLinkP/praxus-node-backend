const { carrera, respuesta_ramos, config_practica, modalidad, practica, pregunta_supervisor, respuesta_supervisor } = require('../../models');


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

export async function actualizar_sueldo_promedio_carrera(){
    const carreras = await carrera.findAll();
    for (let i = 0; i < carreras.length; i++) {
        let config_practicas_carrera = await config_practica.findAll({
            where: {
                id_carrera: carreras[i].id
            }
        });
        for(let k = 0; k < config_practicas_carrera.length;k++){
            let modalidades_config_practica = await modalidad.findAll({
                where: {
                    id_config_practica: config_practicas_carrera[k].id
                }
            });
            for(let j = 0; j < modalidades_config_practica.length;j++){
                let practicas_modalidad = await practica.findAll({
                    where: {
                        id_modalidad: modalidades_config_practica[j].id
                    }
                });
                let suma_sueldos = 0;
                let cantidad_practicas = 0;
                for(let l = 0; l < practicas_modalidad.length;l++){
                    if(practicas_modalidad[l].sueldo){
                        suma_sueldos += practicas_modalidad[l].sueldo;
                        cantidad_practicas += 1;
                    }
                }

                if(cantidad_practicas != 0){
                    let sueldo_promedio = suma_sueldos / cantidad_practicas;
                    const Carrera = await carrera.findOne({ where: { id: carreras[i].id } })
                    Carrera.update({
                        sueldo_promedio: sueldo_promedio
                    })
                }
                
            }
        }
    }
}

export async function actualizar_sueldo_promedio_ramo(){
    const carreras = await carrera.findAll();
    for (let i =0; i < carreras.length; i++){

        let lista_nombre_ramos: string[] = []
        let lista_sueldo_ramos: any[][] = []

        let array_respuesta_ramos = await respuesta_ramos.findAll({
            where: {
                id_carrera: carreras[i].id
            }
        });
        //console.log(array_respuesta_ramos);

        for (let j = 0; j < array_respuesta_ramos.length; j++){
            let respuesta_ramos = array_respuesta_ramos[j].respuesta.split(";;");

            let practica_asociada = await practica.findOne({
                where: {
                    id: array_respuesta_ramos[j].id_practica
                }
            });

            /*
            console.log("respuesta_ramos");
            console.log(respuesta_ramos);

            console.log("practica_asociada");
            console.log(practica_asociada);
            */

            if (practica_asociada != null){
                if (practica_asociada.sueldo != null){
                    //console.log("sueldo no es null");
                    //console.log("lista_nombre_ramos");
                    //console.log(respuesta_ramos);
                    for (let k = 0; k < respuesta_ramos.length; k++){
                        //console.log("k: ",k);
    
                        //if (respuesta_ramos[k] in lista_nombre_ramos){
                        if (lista_nombre_ramos.indexOf(respuesta_ramos[k]) > -1){ //si el ramo ya existe en la lista
                            //console.log("RAMO YA EXISTE");
                            let pos_ramo = lista_nombre_ramos.indexOf(respuesta_ramos[k]);
                            //obteniendo sueldo
                            
                            lista_sueldo_ramos[pos_ramo].push(practica_asociada.sueldo);
                        }
                        else{
                            //console.log("RAMO NO EXISTE");
                            lista_nombre_ramos.push(respuesta_ramos[k]);
                            let lista_sueldo_ramo_aux = [respuesta_ramos[k], practica_asociada.sueldo];
                            lista_sueldo_ramos.push(lista_sueldo_ramo_aux);
                        }
                    }
                }
            }
        }
        //console.log(lista_nombre_ramos);
        //console.log(lista_sueldo_ramos);

        //creando json de sueldo ramos para guardar en base de datos

        let arreglo_sueldo_ramos: any[] = [];
        for (let j = 0; j < lista_sueldo_ramos.length; j++){
            //primera posicion se inserta a arreglo
            arreglo_sueldo_ramos.push(lista_sueldo_ramos[j][0]);
            let sueldo_promedio_ramo = 0;
            for (let k = 1; k < lista_sueldo_ramos[j].length; k++){
                sueldo_promedio_ramo += lista_sueldo_ramos[j][k];
            }
            sueldo_promedio_ramo = Math.floor(sueldo_promedio_ramo / (lista_sueldo_ramos[j].length - 1));
            arreglo_sueldo_ramos.push(sueldo_promedio_ramo);
        }

        //console.log("arreglo_sueldo_ramos");
        //console.log(arreglo_sueldo_ramos);

        let json_ramos_sueldo = { "array": arreglo_sueldo_ramos };

        //console.log("json_ramos_sueldo");
        //console.log(json_ramos_sueldo);

        const Carrera = await carrera.findOne({ where: { id: carreras[i].id } })
        Carrera.update({
            sueldo_ramos: json_ramos_sueldo
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
        let aux_eval_aptitudes_carrera: number[][] = [];
        //recorriendo config_practica de la carrera
        for(let j=0; j<lista_config_practica_carrera.length;j++){
            //console.log("Config_practica");
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
                        //console.log("Modalidad");
                        //recorriendo practicas de la modalidad
                        for(let l=0;l<lista_practicas.length;l++){

                            //console.log("Practica");
        
                            let eval_aptitudes = await respuesta_supervisor.findOne({
                                where: {
                                    id_pregunta_supervisor: pregunta_evaluacion.id,
                                    id_practica: lista_practicas[l].id
                                }
                            });
                            //console.log("Evaluacion Aptitudes: ", eval_aptitudes);
                            if(eval_aptitudes != null){
                                let notas_pregunta_evaluacion = eval_aptitudes.respuesta.split(",");
                                //console.log("Aptitudes Evaluadas: ", aux_eval_aptitudes_carrera);
                                //console.log("Nota Aptitudes: ", notas_pregunta_evaluacion);

                                //recorriendo notas aptitudes
                                for(let m=0;m<notas_pregunta_evaluacion.length;m++){
                                    let pos_aptitud = aux_nombre_aptitudes_carrera.indexOf(aptitudes_pregunta_evaluacion[m]);
                                    if(pos_aptitud== -1){
                                        //aptitud no esta en aux_nombre_aptitudes_carrera
                                        aux_nombre_aptitudes_carrera.push(aptitudes_pregunta_evaluacion[m]);
                                        aux_eval_aptitudes_carrera.push([notas_pregunta_evaluacion[m]]);
                                    }
                                    else{
                                        //aptitud esta en aux_nombre_aptitudes_carrera
                                        aux_eval_aptitudes_carrera[pos_aptitud].push(notas_pregunta_evaluacion[m]);
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
        //console.log("Carrera: ", lista_carreras[i].nombre);
        //console.log("Aptitudes: ", aux_nombre_aptitudes_carrera);
        //console.log("Notas: ", aux_eval_aptitudes_carrera);
        let promedio_aptitudes_carrera: any[] = [];

        if(aux_nombre_aptitudes_carrera.length != 0){
            let promedio_aptitudes=0;
            for (let j=0;j<aux_eval_aptitudes_carrera.length;j++){
                let suma_notas = 0;
                for(let k=0;k<aux_eval_aptitudes_carrera[j].length;k++){
                    suma_notas += Number(aux_eval_aptitudes_carrera[j][k]);
                }
                promedio_aptitudes_carrera.push((suma_notas/aux_eval_aptitudes_carrera[j].length).toFixed(1));
                //dejar promedio con un decimal
                //promedio_aptitudes_carrera[j] = promedio_aptitudes_carrera[j].toFixed(1);
                promedio_aptitudes += Number((suma_notas/aux_eval_aptitudes_carrera[j].length).toFixed(1));
            }
            promedio_aptitudes = Number((promedio_aptitudes/aux_nombre_aptitudes_carrera.length).toFixed(1));
            //console.log("Promedio Aptitudes: ", promedio_aptitudes_carrera);
            //console.log("Promedio General: ", promedio_aptitudes);

            let arreglo_aptitudes: any[] = [];
            arreglo_aptitudes.push(promedio_aptitudes);
            for (let j=0;j<aux_nombre_aptitudes_carrera.length;j++){
                arreglo_aptitudes.push(aux_nombre_aptitudes_carrera[j]);
                arreglo_aptitudes.push(Number(promedio_aptitudes_carrera[j]));
            }
            //console.log("Arreglo Aptitudes: ", arreglo_aptitudes);

            let json_promedio_aptitudes = {"array": arreglo_aptitudes};

            const Carrera = await carrera.findOne({ where: { id: lista_carreras[i].id } })
            Carrera.update({
                promedio_aptitudes: json_promedio_aptitudes
            })
        }
    }
}