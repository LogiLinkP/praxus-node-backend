import * as fs from "fs";
import { patchDocument, TextRun, PatchType } from "docx";

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
export async function crear_doc() {
    let op = false;
    let ind = true;
    let pro = false;
    let apr = true;
    let repr = false;

    const doc = await patchDocument(fs.readFileSync("tmp/test.docx"), {
        patches: {
            rut: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "19.904.099-5",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            rol: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "201773602-k",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            nombre_alumno: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Harold Caballero",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            carrera: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Ing. Civil Informática",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            fecha_ini: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "01/10/2023",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            fecha_fin: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "30/10/2023",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            nombre_empresa: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Doofenshmirtz Malvados y Asociados",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            direccion: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Calle falsa",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            num_dir: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "123",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            ciudad: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Danville",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            fono: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "+56912345678",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            correo: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "harold.caballero@sansano.usm.cl",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            tareas_desarrolladas: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "El estudiante trabajó creando programas para limpiar datos y creó diferentes propuestas de modelos de análisis de patrones para presentarselo al encargado del dpto. de ingeniería",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            observaciones: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "El estudiante realizó todas las tareas que se le asignaron con prolijidad y rapidez. Sin embargo, me parece importante recalcar que tiene una gran falta de iniciativa lo que entorpeció ciertos procesos",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            supervisor: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Salomé Cabezas",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            cargo: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "Jefe de dpto. de análisis de datos",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            fecha_hoy: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: "18/10/2023",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            op: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: op ? "X" : " ",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            ind: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: ind ? "X" : " ",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            pro: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: pro ? "X" : " ",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            apr: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: apr ? "X" : " ",
                    size: 9 * 2,
                    font: "Courier"
                })]
            },
            repr: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({
                    text: repr ? "X" : " ",
                    size: 9 * 2,
                    font: "Courier"
                })]
            }
        }
    });
    fs.writeFileSync("tmp/parcheado.docx", doc);
}