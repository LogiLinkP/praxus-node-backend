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
    for (let i=0;i<lista_empresas.legth;i++){
        let json_aux_empresa = {}
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

                    console.log(arreglo_respuesta_ramos)
                    console.log(id_carrera)
                }

            }
        }
    }
    
}