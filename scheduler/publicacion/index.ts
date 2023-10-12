const { publicacion } = require('../../models');

export async function publicaciones_programadas(frecuencia_informes: string) {
    const lista_publicaciones = await publicacion.findAll();

    //buscar en cada publicacion si la fecha programada ya se cumplió.
    let fecha = new Date();
    for (let publi of lista_publicaciones){
        if(publi.dataValues.fecha_programada == null) continue; 

        if (publi.dataValues.fecha_programada.getTime() <= fecha.getTime()){
            await publi.update({enviable:true})
        }
    }
}