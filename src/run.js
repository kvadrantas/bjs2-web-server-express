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



// DATA RENDERING
app.get("/zmones", (req, res) => {
  let html = "";
  html += "<html>\r\n";
  html += "<body>\r\n";
  html += "<img style = 'height:60px;' src=./mdn-url-all.png>";
  html += "<h1>Žmonių sąrašas</h1>\r\n";
  html += "<ul>\r\n";
  for (const zmogus of zmones) {
    html += `
    <li>
    ${zmogus.vardas} ${zmogus.pavarde} ${zmogus.alga}
    <a href="/zmogusDelete?id=${zmogus.id}">X</a>
    </li>
    `;
  }
  html += "</ul>\r\n";
  html += "</body>\r\n";
  html += "</html>\r\n";
  res.send(html);
});

// DELETING USER
app.get("/zmogusDelete", (req, res) => {
  const id = parseInt(req.query.id);
  const index = zmones.findIndex(e => e.id === id);
  if (index >= 0) {
    zmones.splice(index, 1);
  }
  res.redirect("/zmones");
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