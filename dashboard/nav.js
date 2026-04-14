/**
 * nav.js — Devine News shared navigation
 * Dependency-free. Include at end of <body> on every dashboard page.
 * Reads CURRENT_PAGE from the window to mark the active nav item.
 */
(function () {
  /* ── Config ─────────────────────────────────────────────── */
  const NAV_LINKS = [
    { href: 'index.html',                                        label: 'Portal',           icon: '🏠', internal: true },
    { href: 'submit.html',                                       label: 'Submit',           icon: '✍️', internal: true, cta: true },
    { href: 'https://www.psychedelicsinrecovery.org',            label: 'PIR® Site',        icon: '🌐', tooltip: 'Main Psychedelics In Recovery website' },
    { href: 'https://service.psychedelicsinrecovery.org',        label: 'Service',          icon: '⚙️', tooltip: 'PIR® Service Subdomain — committee resources' },
    { href: 'https://service.psychedelicsinrecovery.org/literature', label: 'LitCom',      icon: '📖', tooltip: 'Literature Committee page on the service subdomain' },
    { href: 'https://docs.google.com/document/d/1or5cB7Ij6BHj-GLm-6V-UeFSA0Re6QUfVaIoAT2rAgI/edit', label: 'Deadlines', icon: '📅', tooltip: 'Monthly topics & submission deadlines' },
    { href: 'https://www.psychedelicsinrecovery.org/meetings/',  label: 'Meetings',         icon: '🗓', tooltip: 'Find an in-person or online PIR® meeting' },
    { href: 'https://github.com/drasticstatic/pir-devine-news-public', label: 'GitHub',    icon: '💻', tooltip: 'Public repo — dashboard source code & release notes' },
    { href: '#drive',                                            label: 'Drive',            icon: '☁️', tooltip: 'Committee Google Drive — set up after gws CLI init', driveLink: true },
  ];

  /* ── Determine current page ──────────────────────────────── */
  const page = (window.CURRENT_PAGE || '').toLowerCase();

  /* ── Build nav HTML ─────────────────────────────────────── */
  const linksHTML = NAV_LINKS.map(link => {
    const isActive = link.internal && (
      (link.href === 'index.html'  && (page === 'index'  || page === '')) ||
      (link.href === 'submit.html' && page === 'submit')
    );
    const ext   = !link.internal ? ' target="_blank" rel="noopener"' : '';
    const tip   = link.tooltip   ? ` data-tooltip="${link.tooltip}"` : '';
    const act   = isActive        ? ' nav-active' : '';
    const cta   = link.cta        ? ' nav-cta' : '';
    const drive = link.driveLink  ? ' id="nav-drive-link"' : '';
    return `<a href="${link.href}" class="nav-link${act}${cta}"${ext}${tip}${drive}>${link.icon} ${link.label}</a>`;
  }).join('\n');

  const navHTML = `
<nav class="pir-nav" id="pir-nav" role="navigation" aria-label="Main navigation">
  <div class="pir-nav__inner">
    <a href="index.html" class="pir-nav__brand">
      <img src="assets/logo-white.png" alt="PIR® Logo" class="pir-nav__logo" />
      <div>
        <span class="pir-nav__title">De Vine <em>News</em></span>
        <span class="pir-nav__sub">PIR® Newsletter</span>
      </div>
    </a>

    <div class="pir-nav__links" id="pir-nav-links">
      ${linksHTML}
    </div>

    <button class="pir-nav__burger" id="pir-nav-burger"
            aria-label="Toggle navigation" aria-expanded="false" aria-controls="pir-nav-links">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

  /* ── Inject before first element of body ────────────────── */
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* ── Hamburger toggle ───────────────────────────────────── */
  const burger = document.getElementById('pir-nav-burger');
  const links  = document.getElementById('pir-nav-links');
  burger.addEventListener('click', function () {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* ── Close menu on link click (mobile) ──────────────────── */
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Close on outside click ─────────────────────────────── */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#pir-nav')) {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Drive link: update from data.json if available ─────── */
  async function updateDriveLink() {
    try {
      const res  = await fetch('data.json?_=' + Date.now());
      const data = await res.json();
      const el   = document.getElementById('nav-drive-link');
      if (!el) return;
      if (data.driveUrl) {
        el.href = data.driveUrl;
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.removeAttribute('data-tooltip');
        el.setAttribute('data-tooltip', 'Open committee Google Drive');
      }
    } catch (_) { /* silent — Drive link stays as placeholder */ }
  }
  updateDriveLink();
})();
