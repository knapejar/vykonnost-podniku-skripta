/* =========================================================================
   SKRIPTA – SDÍLENÉ CHOVÁNÍ
   -------------------------------------------------------------------------
   - Zvýraznění pojmu při příchodu z odkazu (hash / ?zvyraznit=) na 10 s
   - Generování / zvýraznění postranního panelu lekcí
   - Sbalování postranního panelu na mobilech
   - Doplňkové animace rozbalování (progresivní vylepšení nativních <details>)
   Vše čistý vanilla JS, žádné závislosti. Stránka funguje i bez JS.
   ========================================================================= */
(function () {
  'use strict';

  // Globální jmenný prostor pro sdílené utility (viz.js na něj navazuje)
  var Skripta = window.Skripta || (window.Skripta = {});

  /* -----------------------------------------------------------------------
     1. ZVÝRAZNĚNÍ POJMU PŘI PŘÍCHODU Z ODKAZU
     -----------------------------------------------------------------------
     Zdroj cíle: query ?zvyraznit=pojem-eva  NEBO  location.hash #pojem-eva
     Chování: plynulý sroll na prvek + třída .zvyrazneno na 10 sekund. */
  var DOBA_ZVYRAZNENI = 10000; // ms

  function idCileZvyrazneni() {
    // 1) query parametr má přednost (odkazy z jiných lekcí ho používají)
    var params = new URLSearchParams(window.location.search);
    var q = params.get('zvyraznit');
    if (q) return q.replace(/^#/, '');
    // 2) fallback na hash
    if (window.location.hash) return decodeURIComponent(window.location.hash.slice(1));
    return null;
  }

  Skripta.zvyrazniPojem = function (id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;

    // Plynulý scroll na prvek (s ohledem na sticky hlavičku řeší scroll-margin v CSS)
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      el.scrollIntoView();
    }

    el.classList.add('zvyrazneno');
    window.setTimeout(function () {
      el.classList.remove('zvyrazneno');
    }, DOBA_ZVYRAZNENI);
  };

  function inicializujZvyrazneni() {
    var id = idCileZvyrazneni();
    if (id) {
      // Malé zpoždění, aby proběhlo úvodní vykreslení a fonty
      window.setTimeout(function () { Skripta.zvyrazniPojem(id); }, 120);
    }
  }

  /* -----------------------------------------------------------------------
     2. POSTRANNÍ PANEL LEKCÍ
     -----------------------------------------------------------------------
     ROBUSTNÍ VARIANTA: panel je v HTML lekce staticky (funguje i bez JS a
     bez fetch). JS pouze:
       a) zvýrazní aktuální lekci (podle data-atributu nebo názvu souboru),
       b) volitelně umí panel vygenerovat z data/lekce-index.json, pokud
          autor lekce použije prázdný kontejner s data-panel-tema.
     Proč staticky: je to nejspolehlivější, funguje i při otevření souboru
     mimo server a nezávisí na síti. */

  // 2a) Zvýraznění aktuální lekce v již existujícím statickém panelu
  function zvyrazniAktualniLekci() {
    var panel = document.querySelector('[data-panel]');
    if (!panel) return;
    var aktualni = panel.getAttribute('data-aktivni-lekce'); // např. "3.2"
    if (!aktualni) {
      // Fallback: odvodit z názvu souboru v URL
      var soubor = window.location.pathname.split('/').pop();
      var odkaz = panel.querySelector('a[href$="' + soubor + '"]');
      if (odkaz) oznacAktivni(odkaz.closest('.panel__odkaz') || odkaz);
      return;
    }
    var cil = panel.querySelector('[data-lekce-id="' + aktualni + '"]');
    if (cil) oznacAktivni(cil);
  }

  function oznacAktivni(el) {
    el.classList.add('panel__odkaz--aktivni');
    el.setAttribute('aria-current', 'page');
  }

  // 2b) Volitelné generování panelu z registru (pokud si to autor přeje)
  //     Použití: <nav data-panel data-panel-tema="3" data-aktivni-lekce="3.2"></nav>
  Skripta.vygenerujPanel = function (panel) {
    var cisloTemata = parseInt(panel.getAttribute('data-panel-tema'), 10);
    var aktivni = panel.getAttribute('data-aktivni-lekce');
    // Cesta k registru je relativní z lekce/ (../data/…)
    var cesta = panel.getAttribute('data-panel-zdroj') || '../data/lekce-index.json';

    fetch(cesta)
      .then(function (r) { return r.json(); })
      .then(function (temata) {
        var tema = temata.find(function (t) { return t.cislo === cisloTemata; });
        if (!tema) return;
        panel.innerHTML = sestavHtmlPanelu(tema, aktivni);
      })
      .catch(function () { /* tichý fallback – panel zůstane prázdný */ });
  };

  function sestavHtmlPanelu(tema, aktivni) {
    var polozky = tema.lekce.map(function (l) {
      var aktivniTrida = (l.id === aktivni) ? ' panel__odkaz--aktivni' : '';
      var aria = (l.id === aktivni) ? ' aria-current="page"' : '';
      return '<li><a class="panel__odkaz' + aktivniTrida + '" data-lekce-id="' + l.id +
        '" href="' + l.soubor + '"' + aria + '>' +
        '<span class="panel__odkaz-cislo">' + l.id + '</span>' +
        '<span>' + l.nazev + '</span></a></li>';
    }).join('');
    return '' +
      '<a class="panel__zpet" href="../index.html">← Rozcestník</a>' +
      '<div class="panel__tema">Téma ' + tema.cislo + '</div>' +
      '<div class="panel__nazev-tema">' + tema.nazev + '</div>' +
      '<ul class="panel__seznam">' + polozky + '</ul>';
  }

  function inicializujPanel() {
    var panel = document.querySelector('[data-panel]');
    if (!panel) return;
    // Pokud je panel prázdný a má zdroj, vygeneruj ho z registru
    if (panel.hasAttribute('data-panel-tema') && panel.children.length === 0) {
      Skripta.vygenerujPanel(panel);
    } else {
      zvyrazniAktualniLekci();
    }
  }

  /* -----------------------------------------------------------------------
     3. SBALOVÁNÍ PANELU NA MOBILECH
     -----------------------------------------------------------------------
     Autor lekce může vložit tlačítko:
       <button class="panel-prepinac" data-panel-prepinac>Obsah tématu</button>
     JS mu přepíná viditelnost panelu na úzkých displejích. */
  function inicializujPrepinacPanelu() {
    var tlacitko = document.querySelector('[data-panel-prepinac]');
    var panel = document.querySelector('[data-panel]');
    if (!tlacitko || !panel) return;

    // Výchozí stav na mobilu: sbaleno
    var jeMobil = window.matchMedia('(max-width: 900px)').matches;
    if (jeMobil) panel.classList.add('panel--sbaleny');
    aktualizujPopisek();

    tlacitko.addEventListener('click', function () {
      panel.classList.toggle('panel--sbaleny');
      aktualizujPopisek();
    });

    function aktualizujPopisek() {
      var sbaleno = panel.classList.contains('panel--sbaleny');
      tlacitko.setAttribute('aria-expanded', String(!sbaleno));
      tlacitko.innerHTML = (sbaleno ? '▸ ' : '▾ ') + 'Obsah tématu';
    }
  }

  /* -----------------------------------------------------------------------
     4. PLYNULÉ ROZBALOVÁNÍ <details> (progresivní vylepšení)
     -----------------------------------------------------------------------
     Nativní <details> funguje i bez JS. Zde přidáme jemnou animaci výšky
     u prvků .zkus-sam details a .rozbal, aby přechod nebyl skokový. */
  function inicializujPlynuleDetaily() {
    var detaily = document.querySelectorAll('.zkus-sam details, details.rozbal');
    detaily.forEach(function (d) {
      var telo = d.querySelector('.zkus-sam__odpoved, .rozbal__telo');
      if (!telo) return;
      d.addEventListener('toggle', function () {
        if (d.open) {
          // Animace výšky z 0 na auto
          var cil = telo.scrollHeight;
          telo.style.overflow = 'hidden';
          telo.style.maxHeight = '0px';
          // vynutit reflow
          void telo.offsetHeight;
          telo.style.transition = 'max-height 300ms ease';
          telo.style.maxHeight = cil + 'px';
          window.setTimeout(function () {
            telo.style.maxHeight = '';
            telo.style.overflow = '';
            telo.style.transition = '';
          }, 320);
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     5. START
     ----------------------------------------------------------------------- */
  function start() {
    inicializujPanel();
    inicializujPrepinacPanelu();
    inicializujPlynuleDetaily();
    inicializujZvyrazneni();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
