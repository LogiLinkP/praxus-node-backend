import e from "cors";
const { empresa, practica, estudiante, carrera, modalidad, config_practica, pregunta_supervisor, respuesta_supervisor, respuesta_ramos } = require('../../models');
const { consulta_rutificador_co, consulta_boletaofactura_com } = require('../../routes/empresa/utilidades_empresa');

export async function actualizar_empresa() {
    const empresas = await empresa.findAll();
    for (let i = 0; i < empresas.length; i++) {
        let array_practicas = await practica.findAll({
            where: {
                id_empresa: empresas[i].id
            }
        });

        let calificaciones_aux: number[] = [];
        let cantidad_destacados: number = 0.0;

        for (let k = 0; k < array_practicas.length; k++) {
            let estudiante_practica = await estudiante.findOne({
                where: {
                    id: array_practicas[k].id_estudiante
                }
            });
            if (estudiante_practica.empresa_destacada == true) {
                cantidad_destacados += 1;
            }
            if (!isNaN(array_practicas[k].calificacion_empresa)) {
                calificaciones_aux.push(array_practicas[k].calificacion_empresa);
            }
        }

        //let promedio_calificaciones = 
        //calcula promedio de calificaciones
        let promedio_calificaciones = 0;
        for (let k = 0; k < calificaciones_aux.length; k++) {
            promedio_calificaciones += calificaciones_aux[k];
        }
        promedio_calificaciones = promedio_calificaciones / calificaciones_aux.length;

        if (calificaciones_aux.length == 0) {
            promedio_calificaciones = 0;
        }

        let porcentaje_destacados = cantidad_destacados * 100 / array_practicas.length;

        if (array_practicas.length == 0) {
            porcentaje_destacados = 0;
        }

        console.log(empresas[i].nombre_empresa)
        console.log(promedio_calificaciones)
        console.log(porcentaje_destacados)

        const Empresa = await empresa.findOne({ where: { id: empresas[i].id } })

        Empresa.update({
            calificacion_promedio: promedio_calificaciones,
            practicantes_destacados: porcentaje_destacados
        })

    }
}

export async function actualizacion_ramos_empresa() {
    const lista_empresas = await empresa.findAll();
    for (let i=0;i<lista_empresas.length;i++){
        let json_aux_empresa: any = {}
        let practicas_empresa = await practica.findAll({
            where: {
                id_empresa: lista_empresas[i].id
            }
        })
        for (let j=0;j<practicas_empresa.length;j++){
            if(practicas_empresa[j] != null){
                let respuesta_ramos_practica = await respuesta_ramos.findOne({
                    where: {
                        id_practica: practicas_empresa[j].id
                    }
                })
                if (respuesta_ramos_practica != null){
                    let arreglo_respuesta_ramos = respuesta_ramos_practica.respuesta.split(";;")
                    let id_carrera = respuesta_ramos_practica.id_carrera

                    //console.log(arreglo_respuesta_ramos)
                    //console.log(id_carrera)

                    //revisar si id carrera es key en json_aux_empresa
                    if (json_aux_empresa[id_carrera] == null){
                        //console.log("no existe carrera")
                        //añadir carrera
                        json_aux_empresa[id_carrera] = {}
                        json_aux_empresa[id_carrera]["total"] = 0
                    }

                    for (let k=0;k<arreglo_respuesta_ramos.length;k++){
                        if (json_aux_empresa[id_carrera][arreglo_respuesta_ramos[k]] == null){
                            json_aux_empresa[id_carrera][arreglo_respuesta_ramos[k]] = 1
                        }
                        else{
                            json_aux_empresa[id_carrera][arreglo_respuesta_ramos[k]]++
                        }
                        json_aux_empresa[id_carrera]["total"]++
                    }
                }

            }
        }
        //console.log("-----------------------empresa en revision: ",lista_empresas[i].nombre_empresa)
        //console.log(json_aux_empresa)

        let json_ramos_empresa: any = {}
        //obtener todas las llaves de json_aux_empresa
        let keys_json_aux_empresa = Object.keys(json_aux_empresa)
        //console.log(keys_json_aux_empresa)
        for (let j=0;j<keys_json_aux_empresa.length;j++){
            json_ramos_empresa[keys_json_aux_empresa[j]] = []
            let keys_ramos = Object.keys(json_aux_empresa[keys_json_aux_empresa[j]])
            

            keys_ramos.shift()
            //console.log("keys ramos: ",keys_ramos)

            for (let k=0;k<keys_ramos.length;k++){
                json_ramos_empresa[keys_json_aux_empresa[j]].push(keys_ramos[k])
                //console.log(json_aux_empresa[keys_json_aux_empresa[j]])
                let objeto_carrera_ramos = json_aux_empresa[keys_json_aux_empresa[j]]
                let votos_ramos = objeto_carrera_ramos[keys_ramos[k]]
                let votos_totales =  objeto_carrera_ramos["total"]
                //console.log(votos_ramos)
                //console.log("votos ramos: ",json_aux_empresa[keys_json_aux_empresa[j]][keys_ramos[k]])
                //console.log("total votos: ",json_aux_empresa[keys_json_aux_empresa[j]]["total"])
                let porcentaje_ramo = Number((votos_ramos/votos_totales*100).toFixed(1))
                json_ramos_empresa[keys_json_aux_empresa[j]].push(porcentaje_ramo)
            }
        }
        //console.log(json_ramos_empresa)

        const Empresa = await empresa.findOne({ where: { id: lista_empresas[i].id } })

        Empresa.update({
            ramos_utiles:json_ramos_empresa
        })

    }
}

export async function actualizar_sueldo_promedio_empresa(){
    const empresas = await empresa.findAll();
    for (let i = 0; i < empresas.length; i++) {
        let array_practicas = await practica.findAll({
            where: {
                id_empresa: empresas[i].id
            }
        });
        let suma_sueldos = 0;
        let cantidad_practicas = 0;

        for (let k = 0; k < array_practicas.length; k++) {
            if (array_practicas[k].sueldo) {
                suma_sueldos += array_practicas[k].sueldo;
                cantidad_practicas += 1;
            }
        }

        //let sueldo_promedio = 0

        if (cantidad_practicas != 0) {
             let sueldo_promedio = suma_sueldos / cantidad_practicas;
             //console.log(empresas[i].nombre_empresa)
            //console.log(sueldo_promedio)

            const Empresa = await empresa.findOne({ where: { id: empresas[i].id } })

            Empresa.update({
                sueldo_promedio: sueldo_promedio
            })
        }
    }
}

export async function actualizar_aptitudes_empresa(){
    const lista_empresas = await empresa.findAll();
    //recorriendo empresas
    for(let i=0; i<lista_empresas.length;i++){
        //console.log("Recorriendo empresa-------------------------------------------------------------------");
        //console.log("Recorriendo empresas");
        var json_aux_empresa: any = {};
        //recorriendo todas practicas
        let lista_practicas = await practica.findAll({
            where: {
                id_empresa: lista_empresas[i].id
            }
        });
        for(let j=0;j<lista_practicas.length;j++){
            //console.log("Recorriendo practicas");
            if (lista_practicas[j] != null){
                //console.log("Recorriendo practicas no nulas");
                let Estudiante = await estudiante.findOne({
                    where: {
                        id: lista_practicas[j].id_estudiante
                    }
                });
                let Carrera = await carrera.findOne({
                    where: {
                        id: Estudiante.id_carrera
                    }
                });
                //obtener evaluacion de aptitudes
    
                let Modalidad = await modalidad.findOne({
                    where: {
                        id: lista_practicas[j].id_modalidad
                    }
                });
    
                let Config_practica = await config_practica.findOne({
                    where: {
                        id: Modalidad.id_config_practica
                    }
                });
    
                let pregunta_evaluacion_supervisor = await pregunta_supervisor.findOne({
                    where: {
                        id_config_practica: Config_practica.id,
                        tipo_respuesta: "evaluacion"
                    }
                });
    
                let respuesta_evaluacion_supervisor = await respuesta_supervisor.findOne({
                    where: {
                        id_pregunta_supervisor: pregunta_evaluacion_supervisor.id,
                        id_practica: lista_practicas[j].id
                    }
                });

                //console.log("Pregunta evaluacion supervisor: ", pregunta_evaluacion_supervisor);
                //console.log("Respuesta evaluacion supervisor: ",respuesta_evaluacion_supervisor);

                if(respuesta_evaluacion_supervisor != null && pregunta_evaluacion_supervisor != null){
                    if (respuesta_evaluacion_supervisor.respuesta != null && pregunta_evaluacion_supervisor.opciones != null){
                        let aptitudes_pregunta_supervisor = pregunta_evaluacion_supervisor.opciones.split(";;");
                        let notas_evaluacion_apitudes = respuesta_evaluacion_supervisor.respuesta.split(",");
            
                        //console.log("Pregunta evaluacion supervisor: ",aptitudes_pregunta_supervisor);
                        //console.log("Respuesta evaluacion supervisor: ",notas_evaluacion_apitudes);
                        //console.log("Carrera:",Carrera.nombre);
            
                        //verificacion si carrera existe en json_aux_empresa
                        if (json_aux_empresa.hasOwnProperty(Carrera.nombre)){
                            //console.log("Carrera ya existe");
                        }
                        else{
                            //console.log("Carrera no existe");
                            json_aux_empresa[String(Carrera.nombre)] = {};  
                        }

                        //recorriendo aptitudes
                        for(let k=0; k<aptitudes_pregunta_supervisor.length;k++){
                            if (json_aux_empresa[String(Carrera.nombre)].hasOwnProperty(String(aptitudes_pregunta_supervisor[k]))){
                                //aptitud ya existe en la carrera
                                json_aux_empresa[String(Carrera.nombre)][String(aptitudes_pregunta_supervisor[k])].push(notas_evaluacion_apitudes[k]);
                            }
                            else{
                                //aptitud no existe en la carrera
                                json_aux_empresa[String(Carrera.nombre)][String(aptitudes_pregunta_supervisor[k])] = [notas_evaluacion_apitudes[k]];
                            }
                        }
                    }
                }            
            }
        }
        //console.log("Nombre empresa: ", lista_empresas[i].nombre_empresa);
        //console.log("Json aux empresa: ",json_aux_empresa);

        let json_promedio_aptitudes_empresa:any = {};
        let carreras = Object.keys(json_aux_empresa);
        for(let k=0; k<carreras.length;k++){
            let carrera_aux = await carrera.findOne({
                where: {
                    nombre: carreras[k]
                }
            });
            json_promedio_aptitudes_empresa[carrera_aux.id] = [];

            let json_aptitudes = json_aux_empresa[carreras[k]];
            let aptitudes = Object.keys(json_aptitudes);
            for(let l=0; l<aptitudes.length;l++){
                json_promedio_aptitudes_empresa[carrera_aux.id].push(aptitudes[l]);
                let promedio_aux = 0;
                for (let m=0; m<json_aux_empresa[carreras[k]][aptitudes[l]].length;m++){
                    promedio_aux += Number(json_aux_empresa[carreras[k]][aptitudes[l]][m]);
                }
                promedio_aux = Number((promedio_aux / json_aux_empresa[carreras[k]][aptitudes[l]].length).toFixed(1));
                json_promedio_aptitudes_empresa[carrera_aux.id].push(promedio_aux);
            }
        }
        //console.log("Json promedio aptitudes empresa: ",json_promedio_aptitudes_empresa);
        let Empresa = await empresa.findOne({
            where: {
                id: lista_empresas[i].id
            }
        });
        Empresa.update({
            promedio_aptitudes: json_promedio_aptitudes_empresa
        });
    }
}

function shuffle(array: any){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export async function validador_empresa(){
    //const n = 5 //maximo peticiones
    const empresas = await empresa.findAll({where: {empresa_verificada: false}});
    const n = Math.min(empresas.length, 5);
    const empresas_aux = shuffle(empresas);
    //console.log(empresas_aux)
    for(let i = 0; i < n; i++){
        let rut = empresas_aux[i].rut_empresa;
        let rutificador = await consulta_rutificador_co(rut);
        //console.log(1)
        if(rutificador === false){
            let boletaofactura = await consulta_boletaofactura_com(rut);
            if(boletaofactura === false){
                continue;
            }else{
                //console.log(2)
                empresa.update({nombre_empresa: boletaofactura, empresa_verificada: true}, {where: {rut_empresa: rut}})
            }
        }else{
            empresa.update({nombre_empresa: rutificador, empresa_verificada: true}, {where: {rut_empresa: rut}})
        }
    }
}