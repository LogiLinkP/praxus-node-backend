import e from "cors";

const { empresa, practica, estudiante, carrera, modalidad, config_practica, pregunta_supervisor, respuesta_supervisor } = require('../../models');

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