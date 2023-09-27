require('dotenv').config();

export function checkMail(email: string, dominios: any) {
    let correo = email.split("@");
    for (let dominio of dominios) {
        if (dominio.correos_admitidos && dominio.correos_admitidos != "") {
            if (correo[1] == dominio.correos_admitidos) {
                return true;
            }
        }
    }
    return false;
}