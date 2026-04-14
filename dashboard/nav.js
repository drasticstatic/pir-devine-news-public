/**
 * nav.js — Devine News shared navigation
 * Dependency-free. Include at end of <body> on every dashboard page.
 * Reads CURRENT_PAGE from the window to mark the active nav item.
 *
 * Primary links (always visible): Portal · Template · Submit
 * "Links ▾" dropdown (desktop) / inline (mobile): all external + Drive
 */
(function () {
  /* ── Primary links ────────────────────────────────────────── */
  const NAV_PRIMARY = [
    { href: 'index.html',  label: 'Portal', icon: '🏠', internal: true },
    { href: 'submit.html', label: 'Submit', icon: '✍️', internal: true, cta: true },
  ];

  /* ── "More" dropdown links ────────────────────────────────── */
  const NAV_MORE = [
    { href: 'newsletter-template.html',  label: 'Print Template',   icon: '🖨️', internal: true, tooltip: 'Print-ready A4 newsletter layout' },
    { href: 'https://www.psychedelicsinrecovery.org/member-materials/', label: 'Member Materials', icon: '📚', tooltip: 'PIR® member resources & literature' },
    { href: 'https://www.psychedelicsinrecovery.org',            label: 'PIR® Main',        icon: '🌐', tooltip: 'Main Psychedelics In Recovery website' },
    { href: 'https://service.psychedelicsinrecovery.org',        label: 'Service',          icon: '⚙️', tooltip: 'PIR® Service Subdomain — committee resources' },
    { href: 'https://service.psychedelicsinrecovery.org/pr-committee/', label: 'PR Committee', icon: '👥', tooltip: 'PR Committee page on the service subdomain' },
    { href: 'https://service.psychedelicsinrecovery.org/literature', label: 'LitCom',       icon: '📖', tooltip: 'Literature Committee page' },
    { href: 'https://docs.google.com/document/d/1or5cB7Ij6BHj-GLm-6V-UeFSA0Re6QUfVaIoAT2rAgI/edit', label: 'Topics & Deadlines', icon: '📅', tooltip: 'Monthly topics & submission deadlines' },
    { href: 'https://www.psychedelicsinrecovery.org/meetings/',  label: 'Meetings',         icon: '🗓', tooltip: 'Find an in-person or online PIR® meeting' },
    { href: 'https://www.psychedelicsinrecovery.org/12-steps/',  label: '12 Steps',         icon: '📋', tooltip: 'PIR® 12 Steps' },
    { href: 'https://github.com/drasticstatic/pir-devine-news-public', label: 'GitHub',     icon: '💻', tooltip: 'Public repo — dashboard source code & release notes' },
    { href: '#drive', label: 'Google Drive', icon: '☁️', tooltip: 'Committee Google Drive — set up after gws CLI init', driveLink: true },
  ];

  /* ── Determine current page ──────────────────────────────── */
  const page = (window.CURRENT_PAGE || '').toLowerCase();

  /* ── Build a link element ─────────────────────────────────── */
  function buildLink(link, inDropdown) {
    const isActive = link.internal && (
      (link.href === 'index.html'               && (page === 'index' || page === '')) ||
      (link.href === 'submit.html'              && page === 'submit') ||
      (link.href === 'newsletter-template.html' && page === 'template')
    );
    const ext   = !link.internal ? ' target="_blank" rel="noopener"' : '';
    const tip   = (!inDropdown && link.tooltip) ? ` data-tooltip="${link.tooltip}"` : '';
    const act   = isActive ? ' nav-active' : '';
    const cta   = link.cta ? ' nav-cta' : '';
    const drive = link.driveLink ? ' data-drive-link' : '';
    return `<a href="${link.href}" class="nav-link${act}${cta}"${ext}${tip}${drive}>${link.icon} ${link.label}</a>`;
  }

  const primaryHTML = NAV_PRIMARY.map(l => buildLink(l, false)).join('\n');
  const moreHTML    = NAV_MORE.map(l => buildLink(l, true)).join('\n');

  /* ── Build nav HTML ─────────────────────────────────────────── */
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
      ${primaryHTML}
      <div class="nav-more-wrap" id="nav-more-wrap">
        <button class="nav-more-btn" id="nav-more-btn"
                aria-haspopup="true" aria-expanded="false">
          Links ▾
        </button>
        <div class="nav-more-dropdown" id="nav-more-dropdown" role="menu">
          ${moreHTML}
        </div>
      </div>
    </div>

    <button class="pir-nav__burger" id="pir-nav-burger"
            aria-label="Toggle navigation" aria-expanded="false" aria-controls="pir-nav-links">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

  /* ── Inject before first element of body ─────────────────── */
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* ── Hamburger toggle ─────────────────────────────────────── */
  const burger = document.getElementById('pir-nav-burger');
  const links  = document.getElementById('pir-nav-links');
  burger.addEventListener('click', function () {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* ── Close menu on link click (mobile) ─────────────────────── */
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Close on outside click ──────────────────────────────── */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#pir-nav')) {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      closeMore();
    }
  });

  /* ── "More ▾" dropdown toggle ────────────────────────────── */
  const moreBtn  = document.getElementById('nav-more-btn');
  const moreDrop = document.getElementById('nav-more-dropdown');

  function closeMore() {
    moreDrop.classList.remove('is-open');
    moreBtn.classList.remove('is-open');
    moreBtn.setAttribute('aria-expanded', 'false');
  }
  moreBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const open = moreDrop.classList.toggle('is-open');
    moreBtn.classList.toggle('is-open', open);
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  moreDrop.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', closeMore);
  });

  /* ── Drive link: update href from data.json if available ──── */
  async function updateDriveLinks() {
    try {
      const res  = await fetch('data.json?_=' + Date.now());
      const data = await res.json();
      if (!data.driveUrl) return;
      document.querySelectorAll('[data-drive-link]').forEach(el => {
        el.href = data.driveUrl;
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      });
    } catch (_) { /* silent — Drive link stays as placeholder */ }
  }
  updateDriveLinks();
})();
