const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const ROOT = path.join(__dirname, "public");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(req.url.split("?")[0]);

  if (pathname === "/") pathname = "/index.html";

  const file = path.join(ROOT, pathname);

  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Acesso negado");
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Página não encontrada");
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream"
    });

    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log("       DIGITAL ZYRON");
  console.log("================================");
  console.log("Servidor: http://localhost:" + PORT);
});
