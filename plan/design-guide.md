# Design guide – příručka pro autory lekcí

**Toto je ZÁVAZNÝ dokument.** Všechny lekce musí vypadat a chovat se konzistentně,
protože je píše mnoho autorů. Než začnete psát lekci, přečtěte si tuto příručku
a jako kostru použijte **`lekce-sablona.html`** (kopírujte ji, needitujte společné soubory).

---

## 0. Základní pravidla (nepřekročitelná)

1. **Čeština s diakritikou** ve veškerém textu i UI.
2. **Žádné externí zdroje** – zákaz CDN, internetových fontů, npm balíčků. Vše
   běží offline. Používejte pouze sdílené soubory `assets/css/skripta.css`,
   `assets/js/skripta.js`, `assets/js/viz.js`.
3. **Neupravujte společné soubory** (CSS/JS). Potřebujete-li nový vzhled, řešte
   to kompozicí existujících tříd; systémovou změnu nahlaste orchestrátorovi.
4. **Nic se nesmí překrývat, stránka nikdy nesmí přetékat vodorovně.** Kontroluje
   se screenshoty. Široký obsah (tabulky, grafy) patří do obalů s `overflow-x:auto`.
5. **Vše responsivní.** Testujte v úzkém i širokém okně.
6. Komentáře v kódu pište česky.

---

## 1. Umístění souboru a názvy

- Lekce jsou HTML soubory v `public/lekce/`.
- Název souboru **musí** přesně odpovídat poli `soubor` v
  `public/data/lekce-index.json` (schéma `t{T}-l{L}-{slug}.html`, příloha `t12-R-prilohy.html`).
- Z `lekce/` se na assety odkazuje **relativně přes `../`**:
  ```html
  <link rel="stylesheet" href="../assets/css/skripta.css">
  <script src="../assets/js/skripta.js"></script>
  <script src="../assets/js/viz.js"></script>
  ```
- Odkaz na rozcestník: `../index.html`, na rejstřík `../rejstrik.html`, na vzorce `../vzorce.html`.
- Odkaz na jinou lekci (stejná složka): jen název souboru, např. `t5-l2-noa.html`.

---

## 2. Kostra stránky lekce

Pořadí a struktura (viz `lekce-sablona.html`):

```
<header class="horni-lista"> … stejná na všech stránkách … </header>

<div class="lekce-rozvrzeni">
  <button class="panel-prepinac" data-panel-prepinac>Obsah tématu</button>
  <nav class="panel" data-panel data-aktivni-lekce="5.1"> … seznam lekcí tématu … </nav>
  <main id="obsah" class="obsah">
    <header class="lekce-hlavicka"> drobečky + štítek + h1 + strany </header>
    … obsah …
    <nav class="lekce-navigace"> prev / next </nav>
  </main>
</div>

<footer class="paticka"> … </footer>

<script src="../assets/js/skripta.js"></script>
<script src="../assets/js/viz.js"></script>       <!-- jen když používáte vizualizace -->
<script> … inicializace vizualizací této lekce … </script>
```

**Titulek stránky:** `<title>5.1 Podstata a výpočet EVA – Výkonnost podniku</title>`.

### Šířky obsahu
Hlavní obsah `.obsah` automaticky omezuje prózu na komfortních ~72 znaků. Tyto
přímé potomky `.obsah` naopak smějí využít **celou šířku** sloupce: `.tabulka-obal`,
`.viz`, `.vzorec`, `<figure>`. Vkládejte je tedy jako **přímé potomky `.obsah`**,
ať fungují na plnou šířku.

---

## 3. Horní lišta (header)

Kopírujte beze změny ze šablony. Neměňte odkazy ani strukturu. `aria-current="page"`
nastavte jen na stránkách rejstřík/vzorce/rozcestník, **v lekcích na nic** (aktivní
je „Rozcestník" pouze vizuálně přes panel).

---

## 4. Postranní panel lekcí

**Robustní varianta (doporučená a použitá v šabloně): panel vypište staticky v HTML.**
Funguje i bez JS a bez sítě. Nastavte:

```html
<nav class="panel" data-panel data-aktivni-lekce="5.1" aria-label="Lekce tématu 5">
  <a class="panel__zpet" href="../index.html">← Rozcestník</a>
  <div class="panel__tema">Téma 5</div>
  <div class="panel__nazev-tema">Ekonomická přidaná hodnota (EVA)</div>
  <ul class="panel__seznam">
    <li><a class="panel__odkaz" data-lekce-id="5.1" href="t5-l1-podstata-eva.html">
      <span class="panel__odkaz-cislo">5.1</span><span>Podstata a výpočet EVA</span></a></li>
    …všechny lekce AKTUÁLNÍHO tématu…
  </ul>
</nav>
```

- `data-aktivni-lekce` = id právě otevřené lekce → JS jí přidá třídu `.panel__odkaz--aktivni`.
- Uvádějte **jen lekce aktuálního tématu** (ne všech 12 témat).
- Texty a názvy souborů berte přesně z registru.

> Alternativa (generování z JSON): `<nav class="panel" data-panel data-panel-tema="5" data-aktivni-lekce="5.1"></nav>`
> s prázdným obsahem – JS ho naplní přes `fetch('../data/lekce-index.json')`.
> Používejte jen výjimečně; statická varianta je spolehlivější.

**Mobilní sbalení:** ponechte tlačítko `.panel-prepinac` se `data-panel-prepinac`.

---

## 5. Hlavička lekce + drobečky

```html
<header class="lekce-hlavicka">
  <ol class="drobecky">
    <li><a href="../index.html">Rozcestník</a></li>
    <li><a href="../index.html#tema-5">Téma 5 · EVA</a></li>
    <li><span aria-current="page">Lekce 5.1</span></li>
  </ol>
  <span class="lekce-hlavicka__stitek">Lekce 5.1</span>
  <h1>Podstata a výpočet EVA</h1>
  <p class="lekce-hlavicka__strany">Strany 52–56</p>
</header>
```

Drobečky vždy: **Rozcestník › Téma X · zkratka › Lekce X.Y**.

---

## 6. Callouty

Zvýrazněné boxy. Vždy struktura: obal `.callout` + varianta, uvnitř `.callout__ikona`
(emoji, `aria-hidden`), `.callout__nadpis`, `.callout__telo`.

```html
<aside class="callout callout--info">
  <span class="callout__ikona" aria-hidden="true">ℹ️</span>
  <p class="callout__nadpis">Nadpis</p>
  <div class="callout__telo"><p>Text…</p></div>
</aside>
```

| Varianta | Třída | Kdy použít | Doporučená ikona |
|---|---|---|---|
| Informace | `.callout--info` | poznámka, kontext, souvislost | ℹ️ |
| Pozor | `.callout--pozor` | častá chyba, upozornění, výjimka | ⚠️ |
| Příklad | `.callout--priklad` | konkrétní výpočet, ukázka | 📊 / 🧮 |
| Definice | `.callout--definice` | vsuvka s vymezením pojmu | § |

Ikona je volitelná – bez ní se layout přizpůsobí.

---

## 7. Definice pojmu + prolinkování (`.definice`, `.pojem`)

### 7a) Definice pojmu (cíl odkazů)
Každý klíčový pojem definujte boxem `.definice` s **`id="pojem-<slug>"`**:

```html
<section class="definice" id="pojem-eva">
  <h3 class="definice__pojem">Ekonomická přidaná hodnota (EVA)</h3>
  <div class="definice__telo"><p>Text definice…</p></div>
</section>
```

**Konvence slugů pojmů:** prefix `pojem-`, dále název **bez diakritiky**, malými
písmeny, slova oddělená pomlčkami. Příklady:
`pojem-eva`, `pojem-nopat`, `pojem-wacc`, `pojem-cisty-pracovni-kapital`,
`pojem-bod-zvratu`, `pojem-provozni-paka`. Slug musí být v rámci materiálu **unikátní**
a stabilní (rejstřík a prolinkování na něj spoléhají).

### 7b) Vložený odkaz na pojem (`.pojem`)
Odkaz na definici **ve stejné lekci**:
```html
<a class="pojem" href="#pojem-eva">EVA</a>
```
Odkaz na definici **v jiné lekci** (otvírá se v novém tabu a cílový pojem se tam
na 10 s zvýrazní – viz kap. 12):
```html
<a class="pojem" href="t5-l1-podstata-eva.html?zvyraznit=pojem-eva" target="_blank" rel="noopener">EVA</a>
```
> Prolinkování napříč lekcemi obvykle doplní pozdější fáze. Vy především **správně
> označte definice** (`.definice` s `id="pojem-…"`) a pojmy uvnitř své lekce.

---

## 8. Matematika (bez knihoven)

Používejte lehké HTML+CSS helpery. Inline výraz obalte `<span class="math">…</span>`.
Uvnitř `.math` jsou proměnné automaticky kurzívou; operátory a čísla dejte do
`<span class="op">`, resp. `<span class="num">`, aby nebyly kurzívou. Názvy funkcí
(ln, max) do `<span class="fn">`.

### Základní příklady

**EVA = NOPAT − WACC × C:**
```html
<span class="math">EVA<span class="op">=</span>NOPAT<span class="op">−</span>WACC<span class="op">×</span>C</span>
```

**Zlomek (ROE = zisk / vlastní kapitál):**
```html
<span class="math">ROE<span class="op">=</span>
  <span class="frac">
    <span class="frac__cit">čistý zisk</span>
    <span class="frac__jmen">vlastní kapitál</span>
  </span>
</span>
```

**Horní / dolní index (přes `<sup>`/`<sub>`):**
```html
<span class="math">CF<sub>t</sub><span class="op">/</span>(1<span class="op">+</span>r)<sup>t</sup></span>
```

**Suma (Σ) a diskontování (NPV):**
```html
<span class="math">NPV<span class="op">=</span>
  <span style="font-size:1.3em">Σ</span>
  <span class="frac">
    <span class="frac__cit">CF<sub>t</sub></span>
    <span class="frac__jmen">(1<span class="op">+</span>r)<sup>t</sup></span>
  </span>
</span>
```

**Odmocnina (EOQ):**
```html
<span class="math">EOQ<span class="op">=</span>
  <span class="odm"><span class="odm__radikand">
    <span class="frac"><span class="frac__cit">2<span class="op">·</span>D<span class="op">·</span>C<sub>o</sub></span>
    <span class="frac__jmen">C<sub>s</sub></span></span>
  </span></span>
</span>
```

**Řecká písmena / symboly** vkládejte jako Unicode přímo: β, α, Σ, Δ, √, ×, ·, −, ≤, ≥, ⇒.
(Používejte skutečný znak minus „−", ne spojovník „-".)

> Pro **číslovaný, vycentrovaný** vzorec použijte blok `.vzorec` (kap. 9), do jehož
> `.vzorec__telo` vložíte výše uvedený `.math` obsah.

---

## 9. Vzorec (číslovaný blok)

Vycentrovaný, s číslem vpravo a kotvou pro pozdější výpis vzorců:

```html
<div class="vzorec" id="vzorec-eva">
  <div class="vzorec__telo">
    <span class="math">EVA<span class="op">=</span>NOPAT<span class="op">−</span>WACC<span class="op">×</span>C</span>
  </div>
  <div class="vzorec__cislo">(5.1)</div>
</div>
```

- **`id="vzorec-<číslo>"`** – např. `vzorec-5-1` nebo `vzorec-eva`; stabilní a unikátní.
- Číslo v `.vzorec__cislo` odpovídá číslování v textu, formát `(T.n)`.

---

## 10. Tabulky

Vždy obalte do `.tabulka-obal` (zajišťuje `overflow-x:auto` – tabulka nikdy nepřeteče).

```html
<div class="tabulka-obal">
  <table class="tabulka">
    <caption>Tab. 5.1 – Popis (jednotky)</caption>
    <thead>
      <tr><th scope="col">Ukazatel</th><th scope="col" class="cislo">2004</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">NOPAT</th><td class="cislo">100</td></tr>
      <tr class="tabulka__soucet"><th scope="row">EVA</th><td class="cislo hodnota-tvorba">30,0</td></tr>
    </tbody>
  </table>
</div>
```

Zásady:
- Čísla: buňkám dejte třídu **`.cislo`** (zarovná vpravo, tabulkové číslice, nezalamuje).
- Součtový/souhrnný řádek: `<tr class="tabulka__soucet">`.
- Sémantika hodnot: `.hodnota-tvorba` (zelená, kladná EVA/spread), `.hodnota-niceni` (červená).
- Popisek: `<caption>` uvnitř tabulky **nebo** `.tabulka-popis` uvnitř obalu nad tabulkou.
- Záhlaví jsou lepivá (sticky) a řádky zebrované automaticky.
- České formátování čísel: desetinná **čárka**, tisíce oddělené **mezerou** (např. `1 250,5`).

---

## 11. Vizualizace (viz.js)

### 11a) Obal
Každou vizualizaci zabalte do `.viz` s popiskem; kontejner pro SVG nechte prázdný:

```html
<figure class="viz">
  <figcaption>
    <p class="viz__nadpis">Nadpis grafu</p>
    <p class="viz__popis">Krátké vysvětlení, co graf ukazuje.</p>
  </figcaption>
  <div id="viz-nazev"></div>
</figure>
```

Inicializaci volejte v `<script>` na konci stránky (po načtení `viz.js`).

### 11b) KROKOVÁ vizualizace `Skripta.stepper` (klíčová didaktická funkce)

Framework sám vytvoří SVG plátno, tlačítka **◀ Zpět / Další ▶**, popis kroku a
indikátor „Krok i / n". Vy dodáte pole **stavů** a funkci **`render`**, která
nakreslí daný stav. Prvky kreslete pomocí **`util.dej(svg, id, tag, attrs, text)`** –
ta prvek s daným `id` buď vytvoří, nebo znovu použije a jen změní atributy. Díky
tomu **CSS transitions plynule zanimují** přechod mezi kroky.

```html
<div id="viz-eva-vodopad"></div>
<script>
Skripta.stepper('viz-eva-vodopad', {
  sirka: 720, vyska: 360,
  stavy:   [ {showCharge:false, showEva:false}, {showCharge:true, showEva:false}, {showCharge:true, showEva:true} ],
  popisky: [ 'NOPAT = 100.', 'Odečteme WACC × C = 70.', 'Zbude EVA = 30 (tvorba hodnoty).' ],
  render: function (svg, stav, i, u) {
    var base = 300, px = 2.2, nopatH = 100*px, evaH = 30*px, chargeH = 70*px;
    u.dej(svg, 'osa', 'line', { x1:70, y1:base, x2:690, y2:base, stroke:u.barvaOsa, 'stroke-width':1.5 });
    u.dej(svg, 'bar-nopat', 'rect', { x:130, y:base-nopatH, width:110, height:nopatH, rx:5, fill:'#4338ca' });
    u.dej(svg, 'bar-charge','rect', { x:345, y:base-nopatH, width:110, height: stav.showCharge?chargeH:0, rx:5, fill:u.barvaNiceni, opacity: stav.showCharge?1:0 });
    u.dej(svg, 'bar-eva',   'rect', { x:560, y:base-evaH,  width:110, height: stav.showEva?evaH:0,   rx:5, fill:u.barvaTvorba, opacity: stav.showEva?1:0 });
    // …popisky a spojnice viz lekce-sablona.html…
  }
});
</script>
```

**Kompletní, funkční příklad tohoto vodopádu je v `lekce-sablona.html`** – zkopírujte
a upravte. Doporučené vzory krokových vizualizací: vodopád zisku/EVA, postupné
diskontování peněžních toků, růst/pokles sloupců, přesun prvků mezi kategoriemi.

**Zásady stavů a animace:**
- Prvky, které mají mezi kroky *animovat*, musí mít **stabilní `id`** (přes `util.dej`).
- Měňte hlavně **atributy** (x, y, width, height, opacity), ne kompletní překreslení.
- Skrytí prvku řešte `opacity` a/nebo nulovou `height`/`width` (roste/mizí plynule).

### 11c) Statické grafy
- **Sloupcový:** `Skripta.sloupcovyGraf('viz-id', { data:[{popisek:'2004', hodnota:30}], formatDesetin:1 })`.
  Záporné hodnoty se automaticky obarví červeně (ničení hodnoty).
- **Čárový:** `Skripta.carovyGraf('viz-id', { serie:[{ nazev:'EVA', body:[{x:'2004',y:30}] }] })`.

### 11d) Utility v `render` (parametr `u` / `Skripta.viz`)
- `u.el(tag, attrs, text|deti)` – vytvoří SVG element.
- `u.dej(svg, id, tag, attrs, text)` – persistentní element (pro animaci).
- `u.skala(d0,d1,r0,r1)` – lineární škála.
- `u.formatCislo(v, desetin)` – české formátování čísla.
- Barvy: `u.barvy` (paleta), `u.barvaTvorba` (zelená), `u.barvaNiceni` (červená),
  `u.barvaOsa`, `u.barvaMrizka`, `u.barvaText`.

> **SVG kreslí přes `viewBox` a `width:100%`** – graf je responsivní a nikdy nepřeteče.
> Volte `sirka`/`vyska` jen jako poměr stran (např. 720×360).

---

## 12. Zvýraznění pojmu při příchodu z odkazu (automatika `skripta.js`)

Když se stránka otevře s `?zvyraznit=pojem-eva` **nebo** `#pojem-eva`, JS najde prvek
s tímto `id`, plynule na něj odscroluje a na **10 sekund** mu přidá třídu `.zvyrazneno`.
Nemusíte nic programovat – stačí:
1. mít definici s `id="pojem-…"` (kap. 7a),
2. odkazovat na ni napříč lekcemi přes `?zvyraznit=` s `target="_blank"` (kap. 7b).

Funguje i pro `id` vzorců (`#vzorec-…`), pokud na ně odkážete.

---

## 13. Zkus sám 💡

Rozbalovací box. Zadání je vidět vždy, řešení až po kliknutí (nativní `<details>`,
funguje i bez JS; `skripta.js` přidá plynulou animaci):

```html
<section class="zkus-sam">
  <div class="zkus-sam__zadani">
    <p class="zkus-sam__stitek">Zkus sám 💡</p>
    <p>Otázka nebo úvaha…</p>
  </div>
  <details>
    <summary>Zobrazit řešení</summary>
    <div class="zkus-sam__odpoved"><p>Řešení…</p></div>
  </details>
</section>
```

---

## 14. Závěrečné otázky

Blok na konci lekce. Každá otázka má text a **odděleně** dropdown „Nápověda" a
dropdown „Správná odpověď" (student vidí nejdřív jen otázku):

```html
<section class="otazky">
  <h2 class="otazky__nadpis">Otázky k procvičení</h2>

  <div class="otazka">
    <p class="otazka__text"><span class="otazka__cislo">1</span>Text otázky?</p>
    <div class="otazka__nastroje">
      <details class="rozbal rozbal--napoveda">
        <summary>Nápověda</summary>
        <div class="rozbal__telo"><p>Nápověda…</p></div>
      </details>
      <details class="rozbal rozbal--odpoved">
        <summary>Správná odpověď</summary>
        <div class="rozbal__telo"><p>Odpověď…</p></div>
      </details>
    </div>
  </div>
  <!-- další .otazka … -->
</section>
```

Doporučení: 3–6 otázek na lekci; číslujte `.otazka__cislo` postupně.

---

## 15. Prev / Next navigace

Na konci `.obsah` (za otázkami). Vždy dva sloupce; chybějící směr nahraďte
prázdným prvkem kvůli zarovnání:

```html
<nav class="lekce-navigace" aria-label="Navigace mezi lekcemi">
  <a class="lekce-navigace__odkaz" href="t5-l0-predchozi.html">
    <span class="lekce-navigace__smer">← Předchozí lekce</span>
    <span class="lekce-navigace__nazev">5.0 Název předchozí</span>
  </a>
  <a class="lekce-navigace__odkaz lekce-navigace__odkaz--dalsi" href="t5-l2-noa.html">
    <span class="lekce-navigace__smer">Další lekce →</span>
    <span class="lekce-navigace__nazev">5.2 Účetní úpravy rozvahy – vymezení NOA</span>
  </a>
</nav>
```

- **První lekce tématu:** místo „předchozí" vložte
  `<span class="lekce-navigace__odkaz lekce-navigace__odkaz--prazdny" aria-hidden="true"></span>`.
- **Poslední lekce tématu:** „další" může vést na první lekci následujícího tématu
  (podle registru), nebo nechte prázdný prvek.
- Cíle a názvy berte z `data/lekce-index.json`.

---

## 16. Sémantické barvy hodnotového řízení

Pro finanční tématiku (EVA spread apod.) používejte konzistentně:
- **Tvorba hodnoty** (kladné, dobré): zelená – `.hodnota-tvorba`, `var(--barva-tvorba)`, `u.barvaTvorba`.
- **Ničení hodnoty** (záporné, špatné): červená – `.hodnota-niceni`, `var(--barva-niceni)`, `u.barvaNiceni`.
- Primární akcent (neutrální zvýraznění, nadpisy grafů): indigo `var(--barva-akcent)`.

---

## 17. Přehled klíčových CSS tříd (rychlá reference)

| Oblast | Třídy |
|---|---|
| Rozvržení | `.lekce-rozvrzeni`, `.panel`, `.obsah`, `.obal` |
| Panel | `.panel__zpet`, `.panel__tema`, `.panel__nazev-tema`, `.panel__seznam`, `.panel__odkaz`, `.panel__odkaz--aktivni`, `.panel-prepinac` |
| Hlavička | `.lekce-hlavicka`, `.lekce-hlavicka__stitek`, `.lekce-hlavicka__strany`, `.drobecky` |
| Callouty | `.callout` + `.callout--info` / `--pozor` / `--priklad` / `--definice`, `.callout__ikona/__nadpis/__telo` |
| Pojmy | `.definice` (`id="pojem-…"`), `.definice__pojem`, `.definice__telo`, `.pojem`, `.zvyrazneno` |
| Matematika | `.math`, `.op`, `.num`, `.fn`, `.frac`/`.frac__cit`/`.frac__jmen`, `.odm`/`.odm__radikand` |
| Vzorec | `.vzorec`, `.vzorec__telo`, `.vzorec__cislo` |
| Tabulky | `.tabulka-obal`, `.tabulka`, `.tabulka-popis`, `.cislo`, `.tabulka__soucet`, `.hodnota-tvorba`, `.hodnota-niceni` |
| Vizualizace | `.viz`, `.viz__nadpis`, `.viz__popis`, `.viz__platno`, `.viz__ovladani` |
| Interakce | `.zkus-sam` (+ `__zadani/__stitek/__odpoved`), `.otazky`, `.otazka` (+ `__cislo/__text/__nastroje`), `.rozbal` (+ `--napoveda/--odpoved`, `__telo`) |
| Navigace | `.lekce-navigace`, `.lekce-navigace__odkaz` (+ `--dalsi/--prazdny`), `.lekce-navigace__smer/__nazev` |
| Tlačítka | `.tlacitko`, `.tlacitko--tlumene` |

---

## 18. Kontrolní seznam před odevzdáním lekce

- [ ] Název souboru přesně dle registru; assety přes `../assets/…`.
- [ ] `<title>` ve tvaru „<id> <název> – Výkonnost podniku".
- [ ] Horní lišta, panel (se `data-aktivni-lekce`), drobečky, hlavička, prev/next.
- [ ] Všechny definice mají `id="pojem-<slug>"` (bez diakritiky, unikátní).
- [ ] Vzorce mají `id` a číslo `(T.n)`.
- [ ] Tabulky v `.tabulka-obal`, čísla mají `.cislo`.
- [ ] Vizualizace v `.viz`; krokové mají smysluplné popisky kroků.
- [ ] Alespoň blok závěrečných otázek s nápovědou i odpovědí.
- [ ] Čeština s diakritikou, žádné externí zdroje.
- [ ] V úzkém i širokém okně nic nepřetéká vodorovně a nepřekrývá se.
```
