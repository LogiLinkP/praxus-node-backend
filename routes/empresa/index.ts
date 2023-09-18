export { };

const cheerio = require('cheerio');
const { empresa } = require('../../models');
const { Router } = require('express');
const routerEmpresa = new Router(); // /empresa
const axios = require("axios");
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


//[GET] para obtener uno
routerEmpresa.get('', async (req: any, res: any) => {
  try {
    if (!("id" in req.query)) {
      res.status(406).json({ message: "Se requiere ingresar id" });
      return;
    }
    const data = await empresa.findOne({
      where: {
        id: req.query.id
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ message: "Error interno" });
  }
});

//[GET] mostrar todos
routerEmpresa.get('/todos', async (req: any, res: any) => {
  try {
    const data = await empresa.findAll();
    if (!data || data.length == 0) {
      res.status(404).json({ message: "No existen empresas" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ message: "Error interno" });
  }
});

//[DELETE] Eliminar
routerEmpresa.delete('/eliminar', (req: any, res: any) => {
  console.log("Eliminando empresa con id: ", req.query.id)
  empresa.destroy({
    where: {
      id: req.query.id
    }
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.sendStatus(200);
    })
    .catch((err: any) => {
      res.sendStatus(500);
      console.log('Error al eliminar empresa', err);
    })
})

//[POST] Crear uno
routerEmpresa.post('/crear', jsonParser, (req: any, res: any) => {
  const { nombre_empresa, rut_empresa, empresa_verificada, dominios_empresa, practicantes_destacados, calificacion_promedio } = req.body;
  console.log("Request de empresa");
  empresa.create({
    nombre_empresa: nombre_empresa,
    rut_empresa: rut_empresa,
    empresa_verificada: empresa_verificada,
    dominios_empresa: dominios_empresa,
    practicantes_destacados: practicantes_destacados,
    calificacion_promedio: calificacion_promedio
  })
    .then((resultados: any) => {
      console.log(resultados);
      res.status(200).json({ id: resultados.dataValues.id });
    })
    .catch((err: any) => {
      console.log('Error al crear empresa', err);
      res.sendStatus(500).json({ message: "Error interno" });
    })
})


//[PUT]
routerEmpresa.put('/actualizar', jsonParser, async (req: any, res: any) => {
  // buscar practica por id
  const Empresa = await empresa.findOne({ where: { id: req.body.id } })
  if (Empresa) {
    // actualizar practica
    Empresa.update(req.body)
      .then((resultados: any) => {
        console.log(resultados);
        res.sendStatus(200);
      })
      .catch((err: any) => {
        res.sendStatus(500).json({ message: "Error interno" });
        console.log('Error al actualizar empresa', err);
      })
  } else {
    console.log("No existe empresa con id: ", req.query.id)
    res.sendStatus(404);
  }
})

routerEmpresa.get('/check_empresa', jsonParser, async (req: any, res: any) => {
  const { rut } = req.query;
  if (!rut) {
    return res.status(400).json({ message: "Se requiere ingresar rut de empresa" });
  }
  try {
    console.log("Consultando rut: ", rut);
    // const consulta = await axios.post(`https://r.rutificador.co/er/${rut}`, {});
    // console.log(consulta.status);
    // console.log(consulta.data);
    // if (!consulta || !consulta.data || consulta.status != 200) {
    //   return res.status(500).json({ message: "Se Ha producido un error" });
    // }
    let data = `<tr>
    <td>ALTECH SPA</td>
    <td>
        <p>M - Actividades Profesionales, Cientificas Y Técnicas</p>
        <p>N - Actividades De Servicios Administrativos Y De Apoyo</p>
    </td>
    <td>
        <p>702 - Actividades De Consultoría De Gestión</p>
        <p>712 - Ensayos Y Análisis Técnicos</p>
        <p>721 - Investigaciones Y Desarrollo Experimental En El Campo De Las Ciencias Naturales Y La Ingeniería</p>
        <p>732 - Estudios De Mercado Y Encuestas De Opinión Pública</p>
        <p>741 - Actividades Especializadas De Diseño</p>
        <p>803 - Actividades De Investigación</p>
    </td>
    <td>
        <p>661903 - Empresas De Asesoría Y Consultoría En Inversión Financiera; Sociedades De Apoyo Al Giro</p>
        <p>702000 - Actividades De Consultoría De Gestión</p>
        <p>712009 - Otros Servicios De Ensayos Y Análisis Técnicos (Excepto Actividades De Plantas De Revisión
            Técnica)
        </p>
        <p>721000 - Investigaciones Y Desarrollo Experimental En El Campo De Las Ciencias Naturales Y La Ingeniería
        </p>
        <p>732000 - Estudios De Mercado Y Encuestas De Opinión Pública</p>
        <p>741009 - Otras Actividades Especializadas De Diseño N.C.P.</p>
        <p>803000 - Actividades De Investigación (Incluye Actividades De Investigadores Y Detectives Privados)</p>
    </td>
    <td>76.637.851-K</td>
</tr>`
    const html = cheerio.load(`<table>${data}</table>`);
    console.log(html("tr").find("td:first").text());

    return res.status(200).json({ message: "Empresa verificada" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno" });
  }


});
module.exports = routerEmpresa;