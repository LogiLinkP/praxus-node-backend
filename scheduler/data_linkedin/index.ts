import { LinkedInProfileScraper } from '../../linkedin-profile-scraper/src';
const { data_linkedin, estudiante } = require("../../models");
const { Op } = require("sequelize");

require('dotenv').config();

export async function retrieve_data_linkedin(perfiles: Array<string>) {
    try {
        const scraper = new LinkedInProfileScraper({
            sessionCookieValue: `${process.env.LINKEDIN_SESSION_COOKIE_VALUE}`,
            keepAlive: true,
            // timeout: 60000,
        });

        await scraper.setup()
        const data = await Promise.all(perfiles.map(async (perfil) => {
            return await scraper.run(perfil)
        }));
        await scraper.close()

        console.log("scrapper data!!!", data)
        return data;
    } catch (error) {
        console.log("ERROR scraper")
        console.log(error)
        console.log("ERROR scraper")
    }

};

export async function save_linkedin_data() {
    const Estudiantes = await estudiante.findAll({
        where: {
            perfil_linkedin: {
                [Op.ne]: null
            }
        }
    });
    const perfiles = Estudiantes.map((est: any) => est.perfil_linkedin);
    console.log(perfiles);
    const data_perfiles: any = await retrieve_data_linkedin(perfiles);
    const fecha = new Date();
    let data_a_subir: any = [];
    for (let i = 0; i < perfiles.length; i++) {
        data_a_subir.push({
            id_estudiante: Estudiantes[i].id,
            fecha,
            titulo_profesional: data_perfiles[i]?.userProfile.title,
            ubicacion: data_perfiles[i]?.userProfile.location,
            experiencias: data_perfiles[i]?.experiences,
        })
    }
    await data_linkedin.bulkCreate(data_a_subir);
    return;
}