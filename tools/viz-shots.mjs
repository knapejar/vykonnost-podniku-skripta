// Screenshot vícestavové (krokové) vizualizace: klikne na tlačítko „Další" a po každém
// kroku vyfotí zadaný element. Použití ve Fázi 9 (kontrola vizualizací).
//   node tools/viz-shots.mjs <url> <prefix> [--sel=".viz-stepper"] [--next="Další"] [--kroku=3] [--width=1440]
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const url = args[0];
const prefix = args[1];
const get = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d; };
const sel = get('sel', '.viz');
const nextText = get('next', 'Další');
const kroku = Number(get('kroku', '3'));
const width = Number(get('width', '1440'));

if (!url || !prefix) { console.error('Použití: node tools/viz-shots.mjs <url> <prefix> [--sel=] [--next=] [--kroku=]'); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 1000 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

const targets = await page.$$(sel);
console.log('nalezeno vizualizací (' + sel + '):', targets.length);

for (let t = 0; t < targets.length; t++) {
  const box = targets[t];
  await box.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await box.screenshot({ path: `${prefix}-viz${t}-krok0.png` });
  // najdi tlačítko „Další" uvnitř této vizualizace a klikej
  for (let k = 1; k < kroku; k++) {
    const btn = await box.$(`xpath=.//button[contains(normalize-space(.), "${nextText}")]`);
    if (!btn) break;
    const disabled = await btn.isDisabled().catch(() => false);
    if (disabled) break;
    await btn.click();
    await page.waitForTimeout(700); // počkat na plynulou animaci
    await box.screenshot({ path: `${prefix}-viz${t}-krok${k}.png` });
  }
}
await browser.close();
console.log('OK');
