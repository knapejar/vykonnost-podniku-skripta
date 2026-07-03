// Extrahuje registr pojmů (definic) a vzorců ze všech lekcí do JSON.
// Výstup: public/data/rejstrik.json, public/data/vzorce.json
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const lekceDir = path.join(root, 'public', 'lekce');
const dataDir = path.join(root, 'public', 'data');

const index = JSON.parse(readFileSync(path.join(dataDir, 'lekce-index.json'), 'utf8'));
// mapa soubor -> {id, nazev, tema, temaNazev, poradi}
const fileMeta = {};
let poradi = 0;
index.forEach(t => t.lekce.forEach(l => {
  fileMeta[l.soubor] = { id: l.id, nazev: l.nazev, tema: t.cislo, temaNazev: t.nazev, poradi: poradi++ };
}));

const stripTags = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();

const terms = {};   // slug -> {nazev, vyskyty:[{soubor,id,poradi}]}
const formulas = []; // {slug, cislo, soubor, id, poradi, math}

const files = readdirSync(lekceDir).filter(f => f.endsWith('.html'));
for (const f of files) {
  const meta = fileMeta[f];
  if (!meta) { console.warn('BEZ META:', f); continue; }
  const html = readFileSync(path.join(lekceDir, f), 'utf8');

  // --- POJMY ---
  const reP = /id="(pojem-[a-z0-9-]+)"/g;
  let m;
  while ((m = reP.exec(html)) !== null) {
    const slug = m[1];
    const after = html.slice(m.index, m.index + 600);
    // 1) definice__pojem, 2) libovolný nadpis h2-h4, 3) první <strong>
    let name = null;
    let hm = after.match(/class="[^"]*definice__pojem[^"]*"[^>]*>([\s\S]*?)<\//);
    if (hm) name = stripTags(hm[1]);
    if (!name) { hm = after.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/); if (hm) name = stripTags(hm[1]); }
    if (!name) { hm = after.match(/<strong>([\s\S]*?)<\/strong>/); if (hm) name = stripTags(hm[1]); }
    if (!name) name = slug.replace(/^pojem-/, '').replace(/-/g, ' ');
    if (!terms[slug]) terms[slug] = { nazev: name, vyskyty: [] };
    // uchovej nejdelší/nejlepší název (definice__pojem má přednost – už je první volbou)
    terms[slug].vyskyty.push({ soubor: f, id: slug, poradi: meta.poradi, lekce: meta.id });
  }

  // --- VZORCE ---
  const reV = /id="(vzorec-[a-z0-9-]+)"/g;
  while ((m = reV.exec(html)) !== null) {
    const slug = m[1];
    const seg = html.slice(m.index, m.index + 1200);
    const cisloM = seg.match(/class="[^"]*vzorec__cislo[^"]*"[^>]*>([\s\S]*?)<\//);
    const cislo = cisloM ? stripTags(cisloM[1]) : '';
    const mathM = seg.match(/class="[^"]*vzorec__telo[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    const mathHtml = mathM ? mathM[1].trim() : '';
    const math = mathHtml ? stripTags(mathHtml) : '';
    formulas.push({ slug, cislo, soubor: f, lekce: meta.id, tema: meta.tema, temaNazev: meta.temaNazev, poradi: meta.poradi, math, mathHtml });
  }
}

// Rejstřík: jeden záznam na pojem, primární výskyt = nejnižší pořadí lekce
const rejstrik = Object.entries(terms).map(([slug, t]) => {
  const v = t.vyskyty.slice().sort((a, b) => a.poradi - b.poradi);
  return { slug, nazev: t.nazev, soubor: v[0].soubor, lekce: v[0].lekce, dalsi: v.slice(1).map(x => x.lekce) };
}).sort((a, b) => a.nazev.localeCompare(b.nazev, 'cs'));

// Vzorce: seřazené dle pořadí lekce, pak výskytu
formulas.sort((a, b) => a.poradi - b.poradi);

writeFileSync(path.join(dataDir, 'rejstrik.json'), JSON.stringify(rejstrik, null, 2), 'utf8');
writeFileSync(path.join(dataDir, 'vzorce.json'), JSON.stringify(formulas, null, 2), 'utf8');
console.log('Pojmů (unikátních):', rejstrik.length, '| Vzorců:', formulas.length);
console.log('Ukázka pojmů:', rejstrik.slice(0, 5).map(r => r.nazev + ' → ' + r.lekce).join(' | '));
console.log('Ukázka vzorců:', formulas.slice(0, 5).map(v => (v.cislo || v.slug) + ' → ' + v.lekce).join(' | '));
