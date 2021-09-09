import express from "express";

const PORT = 3000;
const WEB = "web";

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

const app = express();

app.use(express.static(WEB, {
  index: ["index.html"]
}));

app.get("/labas", (req, res) => {
  console.log(req.ip);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query);
  res.send("labas");
});

app.get("/zmones", (req, res) => {
  let html = "";
  html += "<html>\r\n";
  html += "<body>\r\n";
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

app.get("/zmogusDelete", (req, res) => {
  const id = parseInt(req.query.id);
  const index = zmones.findIndex(e => e.id === id);
  if (index >= 0) {
    zmones.splice(index, 1);
  }
  res.redirect("/zmones");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
