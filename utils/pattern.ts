require('dotenv').config();

export function checkMail(email: string, dominios: any) {
    let correo = email.split("@");
    let lista = [];
    for(let dominio of dominios){
        if(dominio.correos_admitidos != null&& dominio.correos_admitidos != ""){
            lista.push(dominio.correos_admitidos);
        }
    }
    let set = new Set(lista);
    lista = [...set];
    if(lista.length > 2){
        return false;
    }
    if (lista.includes(correo[1])) {
        return true;
    }
    return false;
}