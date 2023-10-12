const { carrera, respuesta_ramos, config_practica, modalidad, practica } = require('../../models');

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

            //----------------------------------------------- HASTA ACA FUNCIONA -----------------------------------------------

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

        console.log("json_ramos_sueldo");
        console.log(json_ramos_sueldo);



        const Carrera = await carrera.findOne({ where: { id: carreras[i].id } })
        Carrera.update({
            sueldo_ramos: json_ramos_sueldo
        })
    }
}