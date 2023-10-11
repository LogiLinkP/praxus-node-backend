const { publicacion } = require('../../models');

export async function publicaciones_programadas(frecuencia_informes: string) {
    const lista_publicaciones = await publicacion.findAll({
        where: { fecha_programada: !null },
    });

    //buscar en cada publicacion si la fecha programada ya se cumplió.
    let fecha = new Date();
    for (let publi of lista_publicaciones) {
        if (publi.fecha_programada >= fecha){
            await publi.update({enviable:true})
        }
    }
}