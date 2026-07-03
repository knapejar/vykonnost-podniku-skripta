# Šablona zadání pro subagenta píšícího JEDNU lekci (Fáze 6)

> Orchestrátor doplní pole {ID}, {NAZEV}, {STRANY}, {SOUBOR}, {TEMA_CISLO}, {TEMA_NAZEV},
> {PREV} a {NEXT} (odkaz + název, nebo „—" pokud neexistuje).

---

Jsi zkušený autor vysokoškolských skript a webový vývojář. Napíšeš JEDNU kompletní, krásnou a didakticky kvalitní HTML lekci studentských skript. Píšeš POUZE tuto jednu lekci.

## Tvoje lekce
- **ID lekce:** {ID} — „{NAZEV}"
- **Téma:** {TEMA_CISLO} — {TEMA_NAZEV}
- **Zdrojové strany:** {STRANY}
- **Cílový soubor (VYTVOŘ):** `c:/Users/Jarda/REPO/Mamka/Skripta/material/public/lekce/{SOUBOR}`
- **Předchozí lekce:** {PREV}
- **Následující lekce:** {NEXT}

## NEJDŘÍV si přečti (POVINNÉ)
1. **Design-guide (ZÁVAZNÝ):** `c:/Users/Jarda/REPO/Mamka/Skripta/material/plan/design-guide.md` — kompletní pravidla komponent, tříd, matematiky, tabulek, vizualizací, navigace. DODRŽUJ do puntíku.
2. **Vzorová šablona:** `c:/Users/Jarda/REPO/Mamka/Skripta/material/plan/lekce-sablona.html` — zkopíruj její kostru a nahraď obsahem. Ukazuje reálné použití všech komponent + krokové vizualizace (viz.js `Skripta.stepper`).
3. **Registr lekcí:** `c:/Users/Jarda/REPO/Mamka/Skripta/material/public/data/lekce-index.json` — pro postranní panel tématu a prev/next.
4. **Osnova této lekce:** `c:/Users/Jarda/REPO/Mamka/Skripta/material/plan/osnova.md` — najdi sekci „### Lekce {ID}" a řiď se poli Klíčové pojmy / Klíčové vzorce / Návrh vizualizací / Nápady na Zkus sám / Stručná náplň.
5. **ZDROJ OBSAHU (jediný pramen pravdy):** `c:/Users/Jarda/REPO/Mamka/Skripta/9131_vykonnost_podniku_03.md`. Najdi strany {STRANY} pomocí značek `<!-- str. N -->` (grepni např. `<!-- str. {první strana} -->`). Čerpej VÝHRADNĚ z těchto stran (plus nezbytný kontext ze sousedních). Přepiš obsah do výukové podoby — NEcituj otrocky, ale zachovej fakta, čísla, vzorce, tabulky a příklady.

## Přísná obsahová pravidla
- **Čeština s diakritikou** všude. Odborný, ale srozumitelný studentský tón.
- **IN-SCOPE:** pouze obsah zdrojových stran. Nevymýšlej vlastní příklady, čísla ani pojmy nad rámec knihy. Nepřidávej vnější znalosti.
- **Originální pojmy a značení** z knihy (EVA, NOPAT, NOA, WACC, RONA, ČPK, spread, …). Zkratky zaveď při prvním výskytu.
- **Vzorce** zapiš přesně dle zdroje včetně čísel vzorců (např. (3.5)); použij HTML+CSS matematiku dle design-guide (`.math`, `.frac`, sub/sup, β, Σ, Δ, √). Každý číslovaný vzorec dej do `.vzorec` s `id` (pro pozdější výpis vzorečků), formát id `vzorec-<cislo>` (např. `vzorec-3-5`).
- **Tabulky** ze zdroje reprodukuj věrně a KRÁSNĚ (komponenta `.tabulka` v `.tabulka-obal`), včetně popisku (číslo a název tabulky dle knihy). Čísla zarovnej vpravo, součty zvýrazni, hodnoty tvorby/ničení hodnoty barevně (`.hodnota-tvorba`/`.hodnota-niceni`) kde to dává smysl.

## Vizualizace (důležité pro kvalitu!)
- Řiď se polem „Návrh vizualizací" z osnovy pro tuto lekci.
- **Statické vizualizace** (grafy/schémata) musí být čisté SVG, jednoznačné, NIC se nesmí překrývat (popisky, osy, hodnoty). Použij pomocníky z `viz.js` (`Skripta.sloupcovyGraf`, `Skripta.carovyGraf`) nebo vlastní pěkné inline SVG dle vzoru v design-guide.
- **Kroková/animovaná vizualizace:** pokud osnova navrhuje proces se stavy „výchozí → interakce → koncový", VYTVOŘ krokovou vizualizaci pomocí `Skripta.stepper` (tlačítka „◀ Zpět" / „Další ▶"), kde se prvek PLYNULE animuje mezi stavy (SVG + CSS transitions). Každý stav měj čitelný popisek. Alespoň jednu takovou vizualizaci zařaď, pokud se v lekci nabízí (dle osnovy). Ověř, že se v žádném stavu nic nepřekrývá.
- Vizualizace musí být responsivní a nesmí způsobit vodorovné přetékání stránky.

## Definice pojmů a kotvy (pro pozdější prolinkování)
- Každý KLÍČOVÝ pojem, který lekce ZAVÁDÍ (viz „Klíčové pojmy"), umísti do boxu `.definice` s `id="pojem-<slug>"` (slug bez diakritiky, malá písmena, pomlčky — viz konvence v design-guide). Např. NOPAT → `id="pojem-nopat"`. Tyto kotvy budou cílem odkazů z jiných lekcí.
- Zatím NEVKLÁDEJ odkazy `.pojem` na jiné lekce (prolinkování dělá pozdější fáze). Piš čistý obsah s definicemi.

## Interaktivní didaktické prvky (POVINNÉ)
- **Alespoň 1–2 boxy „Zkus sám"** (`.zkus-sam`) s úvahou (inspiruj se poli „Nápady na Zkus sám" z osnovy) a rozklikávací odpovědí.
- **Blok závěrečných otázek** (`.otazky`) na konci lekce: 3–5 otázek, každá s rozbalovací **Nápovědou** i oddělenou rozbalovací **Správnou odpovědí**. Otázky musí jít zodpovědět z obsahu lekce.

## Struktura stránky (dle design-guide + šablony)
- Správné `<head>` s relativními cestami `../assets/css/skripta.css`, `../assets/js/skripta.js`, `../assets/js/viz.js`, `<html lang="cs">`, `<meta charset>`, `<title>` „Lekce {ID}: {NAZEV}".
- Horní lišta, dvousloupcové rozvržení: **postranní panel** se seznamem lekcí tématu {TEMA_CISLO} (aktuální zvýrazněná), **hlavní obsah**.
- **Drobečky:** Rozcestník › Téma {TEMA_CISLO} › Lekce {ID}.
- Nadpis lekce, informace o stranách.
- Obsah členěný do sekcí s nadpisy, prokládaný callouty, definicemi, vzorci, tabulkami, vizualizacemi, Zkus sám.
- **Prev/next navigace** dole: {PREV} vlevo, {NEXT} vpravo (relativní odkazy na soubory dle registru; pokud „—", tlačítko vynech/deaktivuj).

## Kontrola před dokončením
- Otevři soubor v duchu: validní HTML, žádné rozbité komponenty, správné cesty, česká diakritika, nic se nepřekrývá.
- Nepoužívej žádné externí zdroje (offline).

Vrať krátkou zprávu: název vytvořeného souboru, počet definic pojmů, počet a typy vizualizací (statické/krokové), počet Zkus sám a závěrečných otázek. Git neřeš — commit dělá orchestrátor.
