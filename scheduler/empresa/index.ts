const { empresa, practica, estudiante } = require('../../models');
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
    const n = 5; //maximo peticiones
    const empresas = await empresa.findAll({where: {empresa_verificada: false}});
    const empresas_aux = shuffle(empresas);
    if(n > empresas_aux.length){
        for(let i = 0; i < empresas_aux.length; i++){
            let rut = empresas_aux[i].rut_empresa;
            let rutificador = await consulta_rutificador_co(rut);
            if(rutificador === false){
                let boletaofactura = await consulta_boletaofactura_com(rut);
                if(boletaofactura === false){
                    continue;
                }else{
                    empresa.update({empresa_verificada: true}, {where: {rut_empresa: rut}})
                }
            }else{
                empresa.update({empresa_verificada: true}, {where: {rut_empresa: rut}})
            }
        }
    }else{
        for(let i = 0; i < n; i++){
            let rut = empresas_aux[i].rut_empresa;
            let rutificador = await consulta_rutificador_co(rut);
            if(rutificador === false){
                let boletaofactura = await consulta_boletaofactura_com(rut);
                if(boletaofactura === false){
                    continue;
                }else{
                    empresa.update({nombre_empresa: boletaofactura, empresa_verificada: true}, {where: {rut_empresa: rut}})
                }
            }else{
                empresa.update({nombre_empresa: rutificador, empresa_verificada: true}, {where: {rut_empresa: rut}})
            }
        }
    }
}