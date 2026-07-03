'use strict';

/*
 * Jednoduchý statický HTTP server postavený POUZE na vestavěných modulech Node.
 * Žádné závislosti, žádné externí balíčky – funguje kompletně offline.
 *
 * Spuštění:  npm start   (nebo  node server.js)
 * Port lze změnit přes proměnnou prostředí PORT (výchozí 4173).
 * Servíruje obsah složky ./public na http://localhost:<PORT>.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Konfigurace ----------------------------------------------------------------
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4173;
const KORENOVA_SLOZKA = path.join(__dirname, 'public');

// Mapování přípon na MIME typy ----------------------------------------------
const MIME_TYPY = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

// Vrátí MIME typ podle přípony souboru
function mimeTyp(cesta) {
  const pripona = path.extname(cesta).toLowerCase();
  return MIME_TYPY[pripona] || 'application/octet-stream';
}

// Odešle 404 stránku
function odesli404(res) {
  const telo = `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 – Stránka nenalezena</title>
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
           background:#f4f6fb; color:#1e293b; display:grid; place-items:center;
           min-height:100vh; margin:0; }
    .box { text-align:center; padding:2.5rem 3rem; background:#fff;
           border-radius:16px; box-shadow:0 10px 40px rgba(30,41,59,.12); }
    h1 { font-size:3.5rem; margin:0; color:#4338ca; }
    p { color:#64748b; }
    a { color:#4338ca; font-weight:600; text-decoration:none; }
    a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div class="box">
    <h1>404</h1>
    <p>Požadovaná stránka nebyla nalezena.</p>
    <p><a href="/">← Zpět na rozcestník</a></p>
  </div>
</body>
</html>`;
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(telo);
}

// Bezpečně sestaví cestu k souboru uvnitř kořenové složky (ochrana proti "../")
function bezpecnaCesta(pozadovanaCesta) {
  // Dekódování URL a odstranění query/hash
  let cista = decodeURIComponent(pozadovanaCesta.split('?')[0].split('#')[0]);
  if (cista === '/' || cista === '') cista = '/index.html';
  // Normalizace a připojení ke kořeni
  const cilova = path.normalize(path.join(KORENOVA_SLOZKA, cista));
  // Ochrana: cílová cesta musí zůstat uvnitř kořenové složky
  if (!cilova.startsWith(KORENOVA_SLOZKA)) return null;
  return cilova;
}

// Hlavní server --------------------------------------------------------------
const server = http.createServer((req, res) => {
  // WHATWG URL API (základ je jen pro parsování cesty, host je bezvýznamný)
  const parsed = new URL(req.url, 'http://localhost');
  let cesta = bezpecnaCesta(parsed.pathname);

  if (cesta === null) {
    odesli404(res);
    return;
  }

  fs.stat(cesta, (err, stat) => {
    // Pokud jde o složku, zkusíme v ní index.html
    if (!err && stat.isDirectory()) {
      cesta = path.join(cesta, 'index.html');
    }

    fs.readFile(cesta, (chyba, data) => {
      if (chyba) {
        odesli404(res);
        return;
      }
      res.writeHead(200, {
        'Content-Type': mimeTyp(cesta),
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  Skripta: Výkonnost podniku z pohledu finančního manažera');
  console.log('  ---------------------------------------------------------');
  console.log(`  Server běží na:  http://localhost:${PORT}`);
  console.log(`  Kořenová složka: ${KORENOVA_SLOZKA}`);
  console.log('  Ukončení: Ctrl+C');
  console.log('');
});
