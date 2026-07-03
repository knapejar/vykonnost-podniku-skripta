// Ověří integritu HTML po prolinkování. Argumenty: seznam názvů souborů (v lekce/) nebo nic = všechny.
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const dir = path.join(root, 'public', 'lekce');
let files = process.argv.slice(2);
if (files.length === 0) files = readdirSync(dir).filter(f => f.endsWith('.html'));

let problems = 0;
for (const f of files) {
  const html = readFileSync(path.join(dir, f.replace(/.*[\\/]/, '')), 'utf8');
  const open = (html.match(/<a[\s>]/g) || []).length;
  const close = (html.match(/<\/a>/g) || []).length;
  const pojem = (html.match(/class="pojem"/g) || []).length;
  const issues = [];
  if (open !== close) issues.push(`nevyvážené <a> (${open}) vs </a> (${close})`);
  // vnořené odkazy: <a ... <a
  if (/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/.test(html)) issues.push('možný vnořený <a>');
  // pojem odkaz uvnitř svg
  const svgs = html.match(/<svg[\s\S]*?<\/svg>/g) || [];
  if (svgs.some(s => s.includes('class="pojem"'))) issues.push('.pojem odkaz uvnitř <svg>');
  // pojem odkaz uvnitř script
  const scripts = html.match(/<script[\s\S]*?<\/script>/g) || [];
  if (scripts.some(s => s.includes('class="pojem"'))) issues.push('.pojem odkaz uvnitř <script>');
  // href tvar
  // Akceptуj cross-lekční (?zvyraznit=pojem-) i vnitrostránkové (#pojem-) odkazy
  const badHref = (html.match(/class="pojem"[^>]*href="([^"]*)"/g) || []).filter(h => !/(\?zvyraznit=pojem-|#pojem-)/.test(h));
  if (badHref.length) issues.push(`${badHref.length}× pojem odkaz se špatným href`);
  const flag = issues.length ? 'CHYBA' : 'OK';
  if (issues.length) problems++;
  console.log(`${flag}  ${f}  | pojem-odkazů: ${pojem}` + (issues.length ? '  → ' + issues.join('; ') : ''));
}
console.log(problems ? `\n⚠ Problémových souborů: ${problems}` : '\n✔ Vše v pořádku');
