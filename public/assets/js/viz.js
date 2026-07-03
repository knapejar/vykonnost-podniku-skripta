/* =========================================================================
   SKRIPTA – FRAMEWORK PRO VIZUALIZACE (viz.js)
   -------------------------------------------------------------------------
   Znovupoužitelné API pro:
     A) KROKOVÉ (animované) vizualizace ovládané tlačítky „◀ Zpět / Další ▶".
        Prvky se plynule animují ze stavu do stavu (CSS transitions na SVG).
     B) Pomocníky pro časté statické grafy (sloupcový, čárový) v čistém SVG.

   Vše vanilla JS + inline SVG. Žádné knihovny, žádné externí zdroje.
   Navazuje na window.Skripta (definováno ve skripta.js; pokud se načte
   samostatně, jmenný prostor si vytvoří samo).
   =========================================================================

   ---- RYCHLÝ PŘEHLED API ----

   Skripta.stepper(elId, {
     stavy:   [ …libovolná data pro každý krok… ],   // pole stavů
     popisky: [ "text kroku 1", "text kroku 2", … ], // volitelné popisky
     sirka:   720, vyska: 360,                        // volitelné rozměry SVG
     render:  function (svg, stav, index, util) { … } // vykreslí daný stav
   });
     → Framework vytvoří SVG plátno + ovládací tlačítka + indikátor kroku.
       render() se volá při každé změně kroku; prvky se stejným atributem
       „id" v SVG si mezi kroky zachovávají identitu, takže CSS transitions
       je plynule zanimují (měníte jen atributy, ne přerýsováváte vše).

   Skripta.sloupcovyGraf(elId, { … });   // statický sloupcový graf
   Skripta.carovyGraf(elId, { … });      // statický čárový graf

   Pomocné utility pro render():
     util.el(tag, attrs, textNeboDeti)   // vytvoří SVG element
     util.skala(...), util.barvy, util.formatCislo(...)
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var Skripta = window.Skripta || (window.Skripta = {});
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // Paleta grafů (odpovídá CSS proměnným --graf-*)
  var BARVY = ['#4338ca', '#0891b2', '#16a34a', '#d97706', '#db2777', '#7c3aed'];
  var BARVA_TVORBA = '#16a34a';
  var BARVA_NICENI = '#dc2626';
  var BARVA_OSA = '#94a3b8';
  var BARVA_MRIZKA = '#e2e8f0';
  var BARVA_TEXT = '#475569';

  /* -----------------------------------------------------------------------
     UTILITY
     ----------------------------------------------------------------------- */

  // Vytvoří SVG element s atributy. Děti mohou být string (text) nebo pole uzlů.
  function el(tag, attrs, deti) {
    var node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        node.setAttribute(k, String(attrs[k]));
      });
    }
    if (typeof deti === 'string' || typeof deti === 'number') {
      node.textContent = String(deti);
    } else if (Array.isArray(deti)) {
      deti.forEach(function (d) { if (d) node.appendChild(d); });
    }
    return node;
  }

  // Lineární škála: mapuje hodnotu z [d0,d1] na [r0,r1]
  function skala(d0, d1, r0, r1) {
    return function (v) {
      if (d1 === d0) return r0;
      return r0 + (v - d0) * (r1 - r0) / (d1 - d0);
    };
  }

  // Formát čísla v českém stylu (mezera jako oddělovač tisíců, čárka desetinná)
  function formatCislo(v, desetinnych) {
    if (v === null || v === undefined || isNaN(v)) return '–';
    var opts = {};
    if (typeof desetinnych === 'number') {
      opts.minimumFractionDigits = desetinnych;
      opts.maximumFractionDigits = desetinnych;
    }
    try {
      return new Intl.NumberFormat('cs-CZ', opts).format(v);
    } catch (e) {
      return String(v);
    }
  }

  var util = {
    el: el,
    skala: skala,
    barvy: BARVY,
    barvaTvorba: BARVA_TVORBA,
    barvaNiceni: BARVA_NICENI,
    barvaOsa: BARVA_OSA,
    barvaMrizka: BARVA_MRIZKA,
    barvaText: BARVA_TEXT,
    formatCislo: formatCislo
  };
  Skripta.viz = util; // zpřístupníme utility i navenek

  // Vyprázdní uzel
  function vycisti(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Najde cílový kontejner podle id nebo elementu
  function najdiKontejner(elId) {
    var host = (typeof elId === 'string') ? document.getElementById(elId) : elId;
    if (!host) {
      console.warn('[viz] Kontejner nenalezen:', elId);
    }
    return host;
  }

  /* =======================================================================
     A) KROKOVÁ VIZUALIZACE (stepper)
     ======================================================================= */
  Skripta.stepper = function (elId, config) {
    var host = najdiKontejner(elId);
    if (!host) return null;

    var stavy = config.stavy || [];
    var popisky = config.popisky || [];
    var sirka = config.sirka || 720;
    var vyska = config.vyska || 360;
    var render = config.render;
    if (typeof render !== 'function') {
      console.warn('[viz] stepper: chybí funkce render()');
      return null;
    }

    var index = 0;

    // --- Sestavení DOM struktury ---
    vycisti(host);
    host.classList.add('viz__stepper');

    var platno = document.createElement('div');
    platno.className = 'viz__platno';

    var svg = el('svg', {
      viewBox: '0 0 ' + sirka + ' ' + vyska,
      role: 'img',
      preserveAspectRatio: 'xMidYMid meet'
    });
    platno.appendChild(svg);

    var ovladani = document.createElement('div');
    ovladani.className = 'viz__ovladani';

    var btnZpet = document.createElement('button');
    btnZpet.className = 'tlacitko tlacitko--tlumene';
    btnZpet.type = 'button';
    btnZpet.innerHTML = '◀ Zpět';

    var btnVpred = document.createElement('button');
    btnVpred.className = 'tlacitko';
    btnVpred.type = 'button';
    btnVpred.innerHTML = 'Další ▶';

    var popis = document.createElement('p');
    popis.className = 'viz__krok-popis';

    var indikator = document.createElement('span');
    indikator.className = 'viz__krok-indikator';

    ovladani.appendChild(btnZpet);
    ovladani.appendChild(btnVpred);
    ovladani.appendChild(popis);
    ovladani.appendChild(indikator);

    host.appendChild(platno);
    host.appendChild(ovladani);

    // --- Vykreslení aktuálního kroku ---
    function vykresli() {
      // Pozn.: render dostává TÝŽ svg uzel při každém kroku. Doporučená
      // strategie autora: elementy mají stabilní id (viz getUse níže) nebo
      // se překreslují – CSS transitions na atributech pak zajistí animaci.
      render(svg, stavy[index], index, util);
      popis.textContent = popisky[index] || '';
      indikator.textContent = 'Krok ' + (index + 1) + ' / ' + stavy.length;
      btnZpet.disabled = (index === 0);
      btnVpred.disabled = (index === stavy.length - 1);
      svg.setAttribute('aria-label', popisky[index] || ('Krok ' + (index + 1)));
    }

    btnZpet.addEventListener('click', function () {
      if (index > 0) { index--; vykresli(); }
    });
    btnVpred.addEventListener('click', function () {
      if (index < stavy.length - 1) { index++; vykresli(); }
    });

    vykresli();

    // Veřejné rozhraní instance
    return {
      svg: svg,
      jdiNa: function (i) { index = Math.max(0, Math.min(stavy.length - 1, i)); vykresli(); },
      dalsi: function () { btnVpred.click(); },
      zpet: function () { btnZpet.click(); },
      index: function () { return index; }
    };
  };

  /* -----------------------------------------------------------------------
     POMOCNÍK: „persistentní" prvek pro plynulou animaci mezi kroky.
     V render() volejte util.dej(svg, 'muj-obdelnik', 'rect', {…}), který
     prvek buď vytvoří (poprvé), nebo znovu použije a jen aktualizuje
     atributy – to je klíč k plynulé CSS animaci mezi kroky.
     ----------------------------------------------------------------------- */
  util.dej = function (parent, id, tag, attrs, text) {
    var node = parent.querySelector('#' + CSS.escape(id));
    if (!node) {
      node = el(tag, { id: id });
      parent.appendChild(node);
    }
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        node.setAttribute(k, String(attrs[k]));
      });
    }
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };

  /* =======================================================================
     B) STATICKÉ GRAFY
     ======================================================================= */

  // Vnitřní okraje grafů
  function okraje(o) {
    return Object.assign({ nahore: 24, vpravo: 24, dole: 48, vlevo: 56 }, o || {});
  }

  /* ---- Sloupcový graf ----
     config: {
       data: [ { popisek:"2003", hodnota: 120, barva?:"#…" }, … ],
       sirka, vyska, jednotka?, nadpisOsyY?, formatDesetin?
     }
     Podporuje i záporné hodnoty (barva ničení/tvorby), pokud nezadáte barvu. */
  Skripta.sloupcovyGraf = function (elId, config) {
    var host = najdiKontejner(elId);
    if (!host) return null;
    var data = config.data || [];
    var sirka = config.sirka || 640;
    var vyska = config.vyska || 340;
    var m = okraje(config.okraje);
    var desetin = (typeof config.formatDesetin === 'number') ? config.formatDesetin : 0;

    var maxH = Math.max(0, Math.max.apply(null, data.map(function (d) { return d.hodnota; })));
    var minH = Math.min(0, Math.min.apply(null, data.map(function (d) { return d.hodnota; })));
    var maNegativni = data.some(function (d) { return d.hodnota < 0; });

    // Rezervace spodních pásem, aby se nic nepřekrývalo:
    //  - PAS_KATEGORIE:    popisky kategorií (roky) VŽDY úplně dole pod grafem
    //  - PAS_ZAP_POPISKY:  místo pod grafem pro datové popisky záporných sloupců
    // Datový popisek záporného sloupce se tak vejde POD spodní hranu sloupce,
    // a přesto zůstane nad řádkem s popisky kategorií.
    var PAS_KATEGORIE = 22;
    var PAS_ZAP_POPISKY = maNegativni ? 22 : 0;
    m.dole = Math.max(m.dole, PAS_KATEGORIE + PAS_ZAP_POPISKY + 6);
    m.nahore = Math.max(m.nahore, 28); // místo pro datové popisky kladných sloupců

    var x0 = m.vlevo, x1 = sirka - m.vpravo;
    var y0 = vyska - m.dole, y1 = m.nahore;
    var yKategorie = vyska - 7; // pevná pozice popisků kategorií na spodní ose
    var sy = skala(minH, maxH, y0, y1);
    var yNula = sy(0);

    var svg = el('svg', { viewBox: '0 0 ' + sirka + ' ' + vyska, role: 'img',
      preserveAspectRatio: 'xMidYMid meet' });

    // Mřížka + osa Y (5 dílků)
    var kroku = 4;
    for (var i = 0; i <= kroku; i++) {
      var v = minH + (maxH - minH) * i / kroku;
      var y = sy(v);
      svg.appendChild(el('line', { x1: x0, y1: y, x2: x1, y2: y,
        stroke: BARVA_MRIZKA, 'stroke-width': 1 }));
      svg.appendChild(el('text', { x: x0 - 8, y: y + 4, 'text-anchor': 'end',
        fill: BARVA_TEXT, 'font-size': 12 }, formatCislo(v, desetin)));
    }

    // Nulová osa zvýrazněná
    svg.appendChild(el('line', { x1: x0, y1: yNula, x2: x1, y2: yNula,
      stroke: BARVA_OSA, 'stroke-width': 1.5 }));

    // Sloupce
    var n = data.length;
    var mezera = 0.32; // podíl mezery
    var krok = (x1 - x0) / n;
    var sirkaSl = krok * (1 - mezera);
    data.forEach(function (d, idx) {
      var cx = x0 + krok * idx + krok / 2;
      var xLeft = cx - sirkaSl / 2;
      var yTop = Math.min(sy(d.hodnota), yNula);
      var h = Math.abs(sy(d.hodnota) - yNula);
      var barva = d.barva || (d.hodnota < 0 ? BARVA_NICENI : BARVY[idx % BARVY.length]);
      svg.appendChild(el('rect', { x: xLeft, y: yTop, width: sirkaSl, height: h,
        rx: 4, fill: barva }));
      // Datový popisek: kladné NAD horní hranu sloupce, záporné POD spodní hranu.
      // U záporného sloupce (yTop + h = spodní hrana) leží popisek v pásmu
      // PAS_ZAP_POPISKY, tedy vždy nad řádkem s popisky kategorií.
      var yLabel = d.hodnota >= 0 ? yTop - 7 : yTop + h + 15;
      svg.appendChild(el('text', { x: cx, y: yLabel, 'text-anchor': 'middle',
        fill: BARVA_TEXT, 'font-size': 12, 'font-weight': 600 },
        formatCislo(d.hodnota, desetin)));
      // Popisek kategorie (osa X) – vždy úplně dole, nikdy na nulové čáře
      svg.appendChild(el('text', { x: cx, y: yKategorie, 'text-anchor': 'middle',
        fill: BARVA_TEXT, 'font-size': 12 }, d.popisek));
    });

    vycisti(host);
    host.appendChild(svg);
    return svg;
  };

  /* ---- Čárový graf ----
     config: {
       serie: [ { nazev:"EVA", body:[{x:"2003",y:12}, …], barva?:"#…" }, … ],
       sirka, vyska, formatDesetin?
     }  (osy X sdílí popisky z první série) */
  Skripta.carovyGraf = function (elId, config) {
    var host = najdiKontejner(elId);
    if (!host) return null;
    var serie = config.serie || [];
    var sirka = config.sirka || 640;
    var vyska = config.vyska || 340;
    var m = okraje(config.okraje);
    var desetin = (typeof config.formatDesetin === 'number') ? config.formatDesetin : 0;

    var vsechnyY = [];
    serie.forEach(function (s) { s.body.forEach(function (b) { vsechnyY.push(b.y); }); });
    var maxY = Math.max.apply(null, vsechnyY);
    var minY = Math.min.apply(null, vsechnyY.concat([0]));
    var popiskyX = (serie[0] ? serie[0].body : []).map(function (b) { return b.x; });
    var n = popiskyX.length;

    var x0 = m.vlevo, x1 = sirka - m.vpravo;
    var y0 = vyska - m.dole, y1 = m.nahore;
    var sx = function (i) { return n <= 1 ? (x0 + x1) / 2 : skala(0, n - 1, x0, x1)(i); };
    var sy = skala(minY, maxY, y0, y1);

    var svg = el('svg', { viewBox: '0 0 ' + sirka + ' ' + vyska, role: 'img',
      preserveAspectRatio: 'xMidYMid meet' });

    // Mřížka + osa Y
    var kroku = 4;
    for (var i = 0; i <= kroku; i++) {
      var v = minY + (maxY - minY) * i / kroku;
      var y = sy(v);
      svg.appendChild(el('line', { x1: x0, y1: y, x2: x1, y2: y,
        stroke: BARVA_MRIZKA, 'stroke-width': 1 }));
      svg.appendChild(el('text', { x: x0 - 8, y: y + 4, 'text-anchor': 'end',
        fill: BARVA_TEXT, 'font-size': 12 }, formatCislo(v, desetin)));
    }
    // Popisky osy X
    popiskyX.forEach(function (px, idx) {
      svg.appendChild(el('text', { x: sx(idx), y: y0 + 20, 'text-anchor': 'middle',
        fill: BARVA_TEXT, 'font-size': 12 }, px));
    });

    // Série
    serie.forEach(function (s, si) {
      var barva = s.barva || BARVY[si % BARVY.length];
      var body = s.body.map(function (b, idx) { return sx(idx) + ',' + sy(b.y); }).join(' ');
      svg.appendChild(el('polyline', { points: body, fill: 'none',
        stroke: barva, 'stroke-width': 2.5, 'stroke-linejoin': 'round',
        'stroke-linecap': 'round' }));
      s.body.forEach(function (b, idx) {
        svg.appendChild(el('circle', { cx: sx(idx), cy: sy(b.y), r: 4,
          fill: '#fff', stroke: barva, 'stroke-width': 2.5 }));
      });
    });

    // Legenda
    if (serie.length > 1) {
      var lx = x0, ly = m.nahore - 8;
      serie.forEach(function (s, si) {
        var barva = s.barva || BARVY[si % BARVY.length];
        svg.appendChild(el('rect', { x: lx, y: ly - 9, width: 12, height: 12, rx: 3, fill: barva }));
        var t = el('text', { x: lx + 18, y: ly + 1, fill: BARVA_TEXT, 'font-size': 12 }, s.nazev);
        svg.appendChild(t);
        lx += 18 + (s.nazev.length * 7) + 24;
      });
    }

    vycisti(host);
    host.appendChild(svg);
    return svg;
  };

})();
