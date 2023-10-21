const { publicacion } = require('../../models');

export async function publicaciones_programadas(frecuencia_informes: string) {
    const lista_publicaciones = await publicacion.findAll();

    //buscar en cada publicacion si la fecha programada ya se cumplió.
    let fecha = new Date();
    for (let publi of lista_publicaciones){
        if(publi.dataValues.enviable == 1) continue; 

        console.log("FECHA 1: ", publi.dataValues.fecha_programada)
        console.log("FECHA 2: ", fecha)
        console.log("Comparativa:", publi.dataValues.fecha_programada.getTime() <= fecha.getTime())
        if (publi.dataValues.fecha_programada.getTime() <= fecha.getTime()){
            await publi.update({enviable:true})
        }
    }
}