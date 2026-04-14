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
    { href: 'newsletter-april-2026.html', label: 'April 2026',  theme: 'Courage', key: 'april-2026'  },
    { href: 'newsletter-march-2026.html', label: 'March 2026',  theme: 'Hope',    key: 'march-2026'  },
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
    <div class="sn-group-title">Editions</div>
    ${editionsHTML}
    <div class="sn-sep"></div>
    <a href="newsletter-template.html" class="sn-link sn-template">🖨️ Print Template</a>
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

})();
