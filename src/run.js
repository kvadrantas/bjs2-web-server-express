// Fast, unopinionated, minimalist web framework for node.
// const express = require('express')
// const app = express()
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// app.listen(3000)

// HTML URL STRUCTURE
// https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL

// EXPRESS SERVER HELP 
// http://expressjs.com/en/5x/api.html#req.query

// HANDLERS HELP
// https://handlebarsjs.com/guide/#what-is-handlebars
// *****************************************************************************


// MAIN/DEFAULT WEB SERVER PARAMETERS
import express from "express";
const app = express();
const PORT = 3000;    // Sets default website port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
const WEB = "web";
app.use(express.static(WEB, {    // Like "Default Document" on ISS
  index: ["index.html"]
}));
// ADDITIONAL WEB SERVER PARAMETERS 
// Suteikia funkcionaluma automatiskai iskaidyti URL'e esancius parametrus
// i atskirus objektus. Visu ju vertes tekstines, todel skaitines reiksmes reikia
// konvertuotis i skaicius.
app.use(express.urlencoded({
  extended: true,
}));



// DATA
let nextId = 1;
const zmones = [
  {
    id: nextId++,
    vardas: "Jonas",
    pavarde: "Jonaitis",
    alga: 7234.56
  },
  {
    id: nextId++,
    vardas: "Petras",
    pavarde: "Petraitis",
    alga: 750
  },
  {
    id: nextId++,
    vardas: "Antanas",
    pavarde: "Antanaitis",
    alga: 750
  },
];



// DATA RENDERING - (HTML RENDER ONLY)
app.get("/zmones", (req, res) => {
  let html = "";
  html += "<html>\r\n";
  html += "<body>\r\n";
  html += "<img style = 'height:60px;' src=./mdn-url-all.png>";
  html += "<h1>Žmonių sąrašas</h1>\r\n";
  html += '<a href="/zmogusEdit">Naujas</a>\r\n';
  html += "<ul>\r\n";
  for (const zmogus of zmones) {
    html += `
    <li>
    <a href="/zmogusEdit?id=${zmogus.id}">${zmogus.vardas} ${zmogus.pavarde}</a>${zmogus.alga}
    <a href="/zmogusDelete?id=${zmogus.id}">X</a>
    </li>
    `;
  }
  html += "</ul>\r\n";
  html += "</body>\r\n";
  html += "</html>\r\n";
  res.send(html);
});

// DELETING USER - (HTML RENDER AND DATA CHANGE)
app.get("/zmogusDelete", (req, res) => {
  const id = parseInt(req.query.id); console.log(req.query);
  const index = zmones.findIndex(e => e.id === id);     // suranda masyve elementa pagal duota id
  console.log(index);
  if (index >= 0) {
    zmones.splice(index, 1);    // istrina masyvo elementa pagal duota id/index
  }
  res.redirect("/zmones");
});

// EDITING USER - (HTML RENDER)
app.get("/zmogusEdit", (req, res) => {
  let zmogus;
  if (req.query.id) {
    // paima is url ID parametra ir pakonvertuoja i skaiciu.
    // req.query.id = url id parametras
    // parseint = convertavimas i skaiciu
    const id = parseInt(req.query.id);
    zmogus = zmones.find((e) => e.id === id);
    if (!zmogus) {
      res.redirect("/zmones");
      return
    }
  }
  // jei zmogus yra undefined - vadinasi kursim nauja
  // jei zmogus rodo i objekta - redaguosim
  let html = "";
  html += '<html>\r\n';
  html += '<body>\r\n';
  html += `<h1>${!zmogus ? "Naujas žmogus" : "Žmogaus informacijos redagavimas"}</h1>\r\n`;
  html += '<form action="/zmogusSave" method="POST">\r\n';
  if (zmogus) {
    html += `<input type="hidden" name="id" value="${zmogus.id}"><br>\r\n`;
  }
  html += `Vardas: <input type="text" name="vardas" value="${zmogus ? zmogus.vardas : ""}"><br>\r\n`;
  html += `Pavarde: <input type="text" name="pavarde" value="${zmogus ? zmogus.pavarde : ""}"><br>\r\n`;
  html += `Alga: <input type="text" name="alga" value="${zmogus ? zmogus.alga : ""}"><br>\r\n`;
  html += '<input style="margin: 20px 0" type="submit" value="Save"><br>\r\n';
  html += '</form>\r\n';
  html += '<a href="/zmones">Back</a>\r\n';
  html += '</body>\r\n';
  html += '</html>\r\n';
  res.send(html);
})

// EDITING OR ADDING NEW USER (DATA CHANGE)
app.post("/zmogusSave", (req, res) => {
  let zmogus;
  console.log(req.body);
  if (req.body.id) {
    const id = parseInt(req.body.id);
    zmogus = zmones.find((e) => e.id === id);
    console.log(zmogus);
    if (!zmogus) {
      res.redirect('/zmones');
      return;
    }
  }
  let klaidos = [];
  if (!req.body.vardas || req.body.vardas.trim() === "") {
    klaidos.push("Vardas negali būti tuščias")
  }
  if (!req.body.pavarde || req.body.pavarde.trim() === "") {
    klaidos.push("Pavardė negali būti tuščia")
  }
  let alga = parseFloat(req.body.alga);
  if (isNaN(alga)) {
    klaidos.push("Neteisingai įvesta alga");
  }

  // error html render
  if (klaidos.length > 0) {
    let html = "";
    html += "<html>\r\n";
    html += "<body>\r\n";
    html += "<h1>Blogi duomenys</h1>\r\n";
    html += "<h2> + klaidos + </h2>\r\n";
    html += `<a href="/zmogusEdit${zmogus ? "/?id=" + zmogus.id : ""}">Atgal</a>\r\n"`;
    html += "</body>\r\n";
    html += "</html>\r\n";
    res.send(html);
  } else {
    if (zmogus) {
      zmogus.vardas = req.body.vardas;
      zmogus.pavarde = req.body.pavarde;
      zmogus.alga = req.body.alga;
    } else {
      zmones.push({
        id: nextId++,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga
      });
    }
    res.redirect("/zmones");
  }
});


// *****************************************************************************
// TEST INFO
// app.get("/labas", (req, res) => {
//   console.log(req.ip);
//   console.log(req.method);
//   console.log(req.path);
//   console.log(req.query);
//   res.send("labas");
// });