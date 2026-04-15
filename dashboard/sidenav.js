/**
 * sidenav.js — Devine News shared side navigation
 * Dependency-free. Include at end of <body> after nav.js.
 *
 * Features:
 *  - Newsletter edition list (hardcoded, update each issue)
 *  - Auto-detects [data-section] elements for in-page jump-tos
 *  - Desktop: persistent left sidebar (body gets padding-left via .has-sidenav)
 *  - Mobile (≤1024px): collapsible drawer with toggle button
 *
 * Per-page config (optional, set before loading this script):
 *   window.CURRENT_EDITION = 'april-2026'  // marks active edition
 */
(function () {

  /* ── Newsletter editions ─────────────────────────────────── */
  const EDITIONS = [
    { href: 'newsletter-april-2026.html',    label: 'April 2026',    theme: 'Courage', key: 'april-2026'    },
    { href: 'newsletter-march-2026.html',    label: 'March 2026',    theme: 'Surrender',    key: 'march-2026'    },
    { href: 'newsletter-february-2026.html', label: 'February 2026', theme: 'Hope',    key: 'february-2026' },
    { href: 'newsletter-january-2026.html',  label: 'January 2026',  theme: 'Honesty', key: 'january-2026'  },
  ];

  const currentEdition = window.CURRENT_EDITION || '';

  /* ── Auto-detect sections on this page ──────────────────── */
  const sections = Array.from(document.querySelectorAll('[data-section]'))
    .map(el => ({ id: el.id, label: el.getAttribute('data-section') }))
    .filter(s => s.id);

  /* ── Build HTML ─────────────────────────────────────────── */
  const editionsHTML = EDITIONS.map(e => {
    const active = e.key === currentEdition ? ' sn-active' : '';
    return `<a href="${e.href}" class="sn-link${active}">
      <span style="display:block;font-size:0.82rem">${e.label}</span>
      <span style="font-size:0.65rem;color:var(--text-3);font-weight:500">${e.theme}</span>
    </a>`;
  }).join('');

  const sectionsHTML = sections.length ? `
    <div class="sn-sep"></div>
    <div class="sn-group-title">This Issue</div>
    ${sections.map(s => `<a href="#${s.id}" class="sn-link sn-jump">${s.label}</a>`).join('')}
  ` : '';

  const sidenavHTML = `
<div class="pir-sidenav" id="pir-sidenav" aria-label="Side navigation">
  <div class="sn-inner">
    <a href="newsletter-template.html" class="sn-link sn-template">📰 Master Template</a>
    <a href="bulletin.html" class="sn-link sn-template">📋 Bulletin</a>
    <div class="sn-sep"></div>
    <div class="sn-group-title">Editions</div>
    ${editionsHTML}
    ${sectionsHTML}
  </div>
</div>
<button class="pir-sidenav-toggle" id="pir-sidenav-toggle"
        aria-label="Toggle side navigation" aria-expanded="false" aria-controls="pir-sidenav"
        title="Newsletter editions">☰ Editions</button>`;

  /* ── Inject ──────────────────────────────────────────────── */
  document.body.insertAdjacentHTML('afterbegin', sidenavHTML);
  document.body.classList.add('has-sidenav');

  const sn     = document.getElementById('pir-sidenav');
  const toggle = document.getElementById('pir-sidenav-toggle');

  /* ── Mobile toggle ──────────────────────────────────────── */
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const open = sn.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕ Close' : '☰ Editions';
  });

  /* ── Close on outside click (mobile) ───────────────────── */
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024
        && !e.target.closest('#pir-sidenav')
        && !e.target.closest('#pir-sidenav-toggle')) {
      sn.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰ Editions';
    }
  });

  /* ── Close sidenav on section link click (mobile) ──────── */
  sn.querySelectorAll('.sn-jump').forEach(a => {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 1024) {
        sn.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰ Editions';
      }
    });
  });

  /* ── Highlight active jump-to section on scroll ─────────── */
  if (sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sn.querySelectorAll('.sn-jump').forEach(a => a.classList.remove('sn-active'));
          const active = sn.querySelector(`.sn-jump[href="#${entry.target.id}"]`);
          if (active) active.classList.add('sn-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  /* ── Edition hero art SVG injection ────────────────────────── */
  /* Replaces .nl-hero-art photo background with animated SVG    */
  const artPanels = document.querySelectorAll('.nl-hero-art');
  if (artPanels.length) {
    const svgHTML = [
      '<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" ',
      'aria-hidden="true" style="width:100%;height:100%;display:block">',
      '<defs><style>',
      '.pir-hue{animation:pir-hue-s 18s linear infinite}',
      '@keyframes pir-hue-s{to{filter:hue-rotate(360deg) brightness(1.18)}}',
      '.pir-lp{animation:pir-lp-s 4.5s ease-in-out infinite}',
      '@keyframes pir-lp-s{0%,100%{opacity:0.82}50%{opacity:1}}',
      '</style></defs>',
      '<rect width="320" height="300" fill="#000814"/>',
      '<g class="pir-hue">',
      /* outer diamond — CW 22s */
      '<polygon points="160,26 274,148 160,270 46,148" fill="none" stroke="#7c3aed" stroke-width="1.5" opacity="0.55">',
      '<animateTransform attributeName="transform" type="rotate" from="0 160 148" to="360 160 148" dur="22s" repeatCount="indefinite"/>',
      '</polygon>',
      /* mid diamond — CCW 15s */
      '<polygon points="160,58 244,148 160,238 76,148" fill="none" stroke="#06b6d4" stroke-width="1.2" opacity="0.65">',
      '<animateTransform attributeName="transform" type="rotate" from="0 160 148" to="-360 160 148" dur="15s" repeatCount="indefinite"/>',
      '</polygon>',
      /* inner diamond — CW 9s offset */
      '<polygon points="160,92 212,148 160,204 108,148" fill="none" stroke="#a855f7" stroke-width="1" opacity="0.72">',
      '<animateTransform attributeName="transform" type="rotate" from="20 160 148" to="380 160 148" dur="9s" repeatCount="indefinite"/>',
      '</polygon>',
      /* orbiting corner dots */
      '<circle cx="160" cy="26" r="3" fill="#7c3aed" opacity="0.9">',
      '<animateTransform attributeName="transform" type="rotate" from="0 160 148" to="360 160 148" dur="22s" repeatCount="indefinite"/>',
      '</circle>',
      '<circle cx="160" cy="58" r="2.5" fill="#06b6d4" opacity="0.85">',
      '<animateTransform attributeName="transform" type="rotate" from="0 160 148" to="-360 160 148" dur="15s" repeatCount="indefinite"/>',
      '</circle>',
      '</g>',
      /* PIR logo — not hue-rotated, gentle pulse */
      '<image class="pir-lp" href="assets/pir-logo-vertical-white.png" x="120" y="100" width="80" height="96"/>',
      '</svg>'
    ].join('');

    artPanels.forEach(function (panel) {
      panel.style.background = '#000814';
      panel.innerHTML        = svgHTML;
    });
  }

  /* ── Print footer injection ──────────────────────────────────── */
  /* A fixed-position bar repeated on every printed page           */
  const printFooter = document.createElement('div');
  printFooter.className = 'pir-print-header';
  printFooter.innerHTML =
    '<img src="assets/pir-logo-vertical-black.png" alt="PIR\u00AE" />' +
    '<span>PIR\u00AE De Vine News &nbsp;\u00B7&nbsp; Psychedelics In Recovery\u2122</span>';
  document.body.appendChild(printFooter);

})();
