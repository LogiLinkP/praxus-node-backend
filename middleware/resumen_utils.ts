const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function gen_resumen(texto: String, model: String = "gpt-3.5-turbo", temperature: Number = 0.5) {
    const prompt = `\
    Tu tarea es extraer la información más relevante del texto y a partir de esa información crear un resumen.
    Extrae la información más importante del siguiente texto, que esta delimitada triple comilla. Asegúrate de preservar los detalles más importantes.
    Text: '''${texto}'''`;

    const respuesta = openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,  // this is the degree of randomness of the model's output
    });
    return new Promise((resolve, reject) => {
        respuesta.then((res: any) => {
            resolve(res.choices[0].message.content);
        })
    })
}