// Znovupoužitelný nástroj pro pořizování screenshotů stránek skript pomocí Playwrightu.
// Použití:
//   node tools/screenshot.mjs <url> <výstup.png> [--full] [--width=1440] [--height=900]
// Pro vícestavové vizualizace použij tools/viz-shots.mjs.
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const url = args[0];
const out = args[1];
const full = args.includes('--full');
const width = Number((args.find(a => a.startsWith('--width=')) || '--width=1440').split('=')[1]);
const height = Number((args.find(a => a.startsWith('--height=')) || '--height=900').split('=')[1]);

if (!url || !out) {
  console.error('Použití: node tools/screenshot.mjs <url> <výstup.png> [--full] [--width=1440]');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log('OK:', out);
