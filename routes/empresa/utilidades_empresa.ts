const axios = require("axios");
const cheerio = require('cheerio');

export async function consulta_rutificador_co(rut_empresa: string): Promise<boolean | string> {
    return new Promise(async (resolve) => {
        const consulta = await axios.post(`https://r.rutificador.co/er/${rut_empresa}`, {});
        if (consulta.status == 200) {
            const html = cheerio.load(`<table>${consulta.data}</table>`);
            const nombre = html("tr").find("td:first").text()
            if (nombre.includes("Error:")) {
                resolve(false);
                return;
            }
            resolve(nombre);
        }
        resolve(false);
    });
}

export async function consulta_boletaofactura_com(rut_empresa: string): Promise<boolean | string> {
    return new Promise(async (resolve) => {

        let payload = new FormData();
        payload.append("term", rut_empresa);
        const consulta = await axios({
            method: "post",
            url: `https://www.boletaofactura.com/rut`,
            data: payload,
        });
        if (consulta.status == 200) {
            const html = cheerio.load(consulta.data);
            const nombre = html("tr").find("td:first").text();
            if (nombre.replace(/ +/g, "") == "") {
                resolve(false);
                return;
            }
            resolve(nombre);
        } else {
            resolve(false);
        }
    });
}

export function formatear_rut_empresa(rut: string): string {
    rut = rut.replace(/[^0-9kK]+/g, '');
    rut = rut.replace(/^0+/, '');
    let rut_splitted = rut.split("");
    let rut_parsed = rut_splitted.pop() + "-";
    let contador = 0;
    while (rut_splitted.length > 0) {
        rut_parsed += rut_splitted.pop();
        contador++;
        if (contador == 3 && rut_splitted.length > 0) {
            rut_parsed += ".";
            contador = 0;
        }
    }
    return rut_parsed.split("").reverse().join("");
}