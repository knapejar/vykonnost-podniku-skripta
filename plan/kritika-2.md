# Kritika osnovy – 2. kolo

Revize po zapracování `korekce-1.md`. Ověřeno proti zdroji `9131_vykonnost_podniku_03.md`
(značky `<!-- str. N -->` a číslování knižních sekcí `## 3.x`, `## 4.x`, `## 8.x`).

**Shrnutí:** Osnova je po prvním kole ve velmi dobrém stavu. Obsah lekcí, pořadí, dopředné
reference i čísla vzorců jsou v pořádku. Zbývají **3 vady v meta-vrstvě** (statistika, rozsahy,
mapovací tabulka), nikoli v samotné náplni lekcí. **Žádná KRITICKÁ.**

---

## STŘEDNÍ

### M1 – Námitka S5 vyřešena jen zdánlivě: řada lekcí přesahuje deklarovaných 7 stran
Hlavička i Statistika tvrdí: *„po rozdělení nejsou v osnově lekce nad 7 stran"* a rámec
„cca 3–7 stran / 15–40 min". To **neplatí**. Rozsahy z osnovy (rozdíl do–od, i po odečtení
jedné sdílené strany dle konvence hranic):

| Lekce | Zdroj | Efektivní rozsah |
|---|---|---|
| 8.1 Strategické investiční rozhodování | 135–144 | ~9 str. |
| 11.4 Oceňování – výnosové metody | 218–227 | ~9 str. |
| 5.7 Zhodnocení EVA + zavedení | 83–91 | ~8 str. |
| 12.8 EVA v PLAST – WACC a výpočet | 277–285 | ~8 str. |
| 12.10 BSC podniku PLAST | 292–300 | ~8 str. |
| dále 7.1, 9.1–9.3, 12.2, 12.3 aj. | | ~7 str. |

Jde o **znovuotevření námitky z 1. kola** – korekce ji označila za ZAPRACOVANOU s nepravdivým
tvrzením, že žádná lekce 7 stran nepřekračuje.
**Návrh opravy:** buď (a) rozšířit deklarovaný rámec na *cca 3–9 stran / 15–50 min* a upravit
odpovídající větu ve Statistice, nebo (b) rozdělit dva nejdelší bloky (8.1 na NPV/IRR vs.
doba návratnosti + reálné opce; 11.4 na DCF vs. EVA/CFROI/kapitalizace). Preferováno (a),
protože obě lekce jsou obsahově soudržné a hutné díky řešeným příkladům.

### M2 – Mapovací tabulka: chybné číslování knižních sekcí u kap. 2, 3 a 4
Tabulka osnova ↔ kniha (přidaná v 1. kole jako řešení S4) uvádí u několika řádků knižní
sekce, které v **tomto zdroji neodpovídají skutečnému číslování** (`## x.y`):

| Řádek tabulky | Uvedeno | Ve zdroji skutečně |
|---|---|---|
| 3.1–3.6 (finanční analýza) | kap. **2.2–2.6** | kap. **2.3** (žádné 2.4–2.6 neexistují) |
| 4.2 (MVA, Excess Return, TSR) | kap. **3.1** | kap. **3.2 / 3.3 / 3.4** |
| 5.1–5.7 (EVA) | kap. **3.2** | kap. **3.5** |
| 6.1–6.4 (SVA, CFROI, CROGA, srovnání) | kap. **3.3–3.5** | kap. **3.6 / 3.7 / 3.8 / 3.9** |
| 9.4–9.5 (kap. struktura, zdroje financování) | kap. **4.8–4.9** | kap. **4.8** (žádné 4.9 neexistuje) |
| 7.1–7.2 / 7.3–7.6 | kap. 4.1 / 4.2–4.4 | 4.1–4.2 / 4.3–4.4 |

Číslování stran v tabulce **je správné**, chybné jsou jen odkazy na sekce. Protože tabulka
slouží autorovi lekce k dohledání místa v knize (a EVA je ve zdroji `## 3.5`, ne 3.2), může
mýlit. Že jde o chybu a ne o jinou konvenci potvrzuje fakt, že jinde osnova cituje sekci
správně („kap. 4.7, str. 161–182").
**Návrh opravy:** přečíslovat sloupec „Knižní kapitola / sekce" podle skutečných hlaviček
zdroje (viz pravý sloupec výše). Horní úroveň (kap. 2→T2+3, kap. 3→T4+5+6, kap. 4→T7+8+9)
i strany zůstávají.

---

## DROBNÉ

### D1 – Statistika naopak zamlčuje podměrečné lekce (druhý konec rozsahu)
Poznámka ve Statistice zmiňuje jako nejkratší jen „1.2 ~3 s., 12.6 ~3 s.". Přehlíží dvě
**ještě kratší** lekce **pod** dolní hranicí 3 stran:
- **7.6 Analýza využití majetku** (134–135, ~1–2 str., sama osnova ji zve „krátká přemosťovací"),
- **11.7 Desatero** (236–237, ~2 str.).
Obojí je obhajitelné (most / syntetický závěr), ale výčet krátkých lekcí je neúplný a floor
3 stran se u nich nedodržuje.
**Návrh opravy:** doplnit 7.6 a 11.7 do poznámky a explicitně je označit za záměrné
sub-limitní přemosťovací/závěrečné jednotky.

### D2 – Drobný dopředný pojem v lekci 6.4 (na hraně, spíše k uvážení)
Lekce 6.4 pracuje s „řetězcem … generátory → ekonomický zisk → cash flow", ačkoli pojem
**generátory hodnoty / value drivers** je formálně zaveden až v 7.1. Ve zdroji je to sekce
3.9 (před kap. 4), takže kniha to má stejně; dopad je nulový. Případně stačí jednoslovná
glosa „(generátory hodnoty – blíže Téma 7)".

---

## Co je naopak v pořádku (ověřeno)
- **Rozsahy stran interně konzistentní** – všechny sdílené hranice jsou jednostránkové,
  žádný dvoustránkový překryv; návaznost stran bez děr.
- **Čísla vzorců faktograficky sedí** – namátkou (3.5), (3.9), (4.30), (4.36), (2.34),
  (4.14), (6.4) se ve zdroji vyskytují právě jednou.
- **Případová studie (kap. 8) namapována přesně** – 12.2/244, 12.4/258, 12.7/271, 12.9/285,
  12.10/292, 12.11/301 (8.8), 12.12/306 (8.9), příloha R/311 vše souhlasí s hlavičkami zdroje.
- **Dopředné závislosti EVA ↔ WACC** ošetřeny (box v 5.1, poznámka v 5.3, odkaz na Téma 9).
- **Pořadí pojmů** bez zpětných kolizí (finanční páka 3.2 → 9; ČPK 3.1 → 8; DuPont 3.6;
  NOA/NOPAT 5.2/5.3 → 12.7; generátory 7.1 → 7.2/12).
- **Počet lekcí 60** – součet po tématech sedí.

---

## Verdikt
**Osnova je schválena k použití – s výhradou opravy 3 meta-nedostatků** (M1, M2, D1).
Vady se netýkají obsahu ani struktury lekcí, ta je připravena jako zadání pro subagenty.
Jde o nesoulad **deklarace vs. skutečnost** (rozsah stran) a **navigační chyby** v mapovací
tabulce, které stačí přepsat – není nutná další strukturální iterace. Doporučuji drobnou
korekci M1/M2/D1 a poté rovnou přejít k Fázi 5.
