const cron = require('node-cron');
const { crear_informes } = require('./informe');
const { actualizar_ramos, actualizar_promedio_aptitudes_carrera } = require('./carrera');
const { actualizar_empresa } = require('./empresa');
const { actualizar_encuesta_practica } = require('./config_practica');
const { save_linkedin_data } = require('./data_linkedin');


// cron basics:
// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *
export class Scheduler {
    constructor() { }

    static schedule() {
        // creacion de informes diarios
        //procesamiento periodico de datos
        cron.schedule('0 0 * * *', () => {
            console.log('Creando informes diarios');
            crear_informes("diario");
        });

        // creacion de informes semanales
        cron.schedule('0 0 * * 1', () => {
            console.log('Creando informes semanales');
            crear_informes("semanal");
        });

        // creacion de informes mensuales
        cron.schedule('0 0 1 * *', () => {
            console.log('Creando informes mensuales');
            crear_informes("mensual");
        });

        cron.schedule('59 23 * * 0', () => {
            //cron.schedule('*/5 * * * *', () => {
            console.log('Actualizando estadisticas de ramos, empresas y encuesta practica');
            actualizar_ramos();
            actualizar_empresa();
            actualizar_encuesta_practica();
        });

        //scrape linkedins
        cron.schedule("0 0 1 1,7 *", () => {
            console.log('Scrapeando linkedins');
            save_linkedin_data();
        });

        //aptitudes carrera
        cron.schedule('* * * * *', () => {
            console.log('actualizando aptitudes carrera');
            actualizar_promedio_aptitudes_carrera()
          });
    }
}

