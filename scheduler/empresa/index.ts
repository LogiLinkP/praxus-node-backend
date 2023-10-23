const { empresa, practica, estudiante, respuesta_ramos } = require('../../models');

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