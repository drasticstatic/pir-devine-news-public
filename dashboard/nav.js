/**
 * nav.js — De Vine News shared navigation
 * Dependency-free. Include at end of <body> on every dashboard page.
 *
 * Primary links (always visible): Portal · Submit · Setup (modal)
 * "Links ▾" dropdown: all external + internal utility links
 */
(function () {

  /* ── Primary links ────────────────────────────────────────── */
  const NAV_PRIMARY = [
    { href: 'index.html',  label: 'Portal', icon: '🏠', internal: true },
    { href: 'submit.html', label: 'Submit', icon: '✍️', internal: true, cta: true },
    { modal: 'modal-nav-setup', label: 'Setup', icon: '⚙️',
      tooltip: 'gws CLI setup guide — connect Google Drive to GitHub' },
  ];

  /* ── "More" dropdown links ────────────────────────────────── */
  const NAV_MORE = [
    { href: 'newsletter-template.html', label: 'Template',         icon: '📰', internal: true, tooltip: 'Web edition template — all content categories' },
    { href: 'bulletin.html',            label: 'Bulletin',          icon: '📋', internal: true, tooltip: 'Fellowship announcements & open service positions' },
    { href: 'https://www.psychedelicsinrecovery.org/member-materials/', label: 'Member Materials', icon: '📚', tooltip: 'PIR® member resources & literature' },
    { href: 'https://www.psychedelicsinrecovery.org',            label: 'PIR® Main',        icon: '🌐', tooltip: 'Main Psychedelics In Recovery website' },
    { href: 'https://service.psychedelicsinrecovery.org',        label: 'Service',          icon: '🔧', tooltip: 'PIR® Service Subdomain — committee resources' },
    { href: 'https://service.psychedelicsinrecovery.org/pr-committee/', label: 'PR Committee', icon: '👥', tooltip: 'PR Committee page on the service subdomain' },
    { href: 'https://service.psychedelicsinrecovery.org/literature', label: 'LitCom',       icon: '📖', tooltip: 'Literature Committee page' },
    { href: 'https://docs.google.com/document/d/1or5cB7Ij6BHj-GLm-6V-UeFSA0Re6QUfVaIoAT2rAgI/edit', label: 'Topics & Deadlines', icon: '📅', tooltip: 'Monthly topics & submission deadlines' },
    { href: 'https://www.psychedelicsinrecovery.org/meetings/',  label: 'Meetings',         icon: '🗓', tooltip: 'Find an in-person or online PIR® meeting' },
    { href: 'https://www.psychedelicsinrecovery.org/12-steps/',  label: '12 Steps',         icon: '📜', tooltip: 'PIR® 12 Steps' },
    { href: 'https://github.com/drasticstatic/pir-devine-news-public', label: 'GitHub',     icon: '💻', tooltip: 'Public repo — dashboard source & release notes' },
    { href: '#drive', label: 'Google Drive', icon: '☁️', tooltip: 'Committee Google Drive — set up after gws CLI init', driveLink: true },
  ];

  /* ── Determine current page ──────────────────────────────── */
  const page = (window.CURRENT_PAGE || '').toLowerCase();

  /* ── Build a nav link element ─────────────────────────────── */
  function buildLink(link, inDropdown) {
    /* Modal trigger — render as styled button */
    if (link.modal) {
      const tip = (!inDropdown && link.tooltip) ? ` data-tooltip="${link.tooltip}"` : '';
      const setupCls = link.modal === 'modal-nav-setup' ? ' nav-setup-btn' : '';
      return `<button class="nav-link${setupCls}" onclick="openModal('${link.modal}')"${tip}>${link.icon} ${link.label}</button>`;
    }
    const isActive = link.internal && (
      (link.href === 'index.html'               && (page === 'index' || page === '')) ||
      (link.href === 'submit.html'              && page === 'submit') ||
      (link.href === 'newsletter-template.html' && page === 'template') ||
      (link.href === 'bulletin.html'            && page === 'bulletin')
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

  /* ── Nav HTML ─────────────────────────────────────────────── */
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

  /* ── Setup modal HTML ─────────────────────────────────────── */
  const setupModalHTML = `
<div class="modal-overlay" id="modal-nav-setup" role="dialog" aria-modal="true" aria-labelledby="nav-setup-title">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('modal-nav-setup')" aria-label="Close">✕</button>
    <div class="modal-eyebrow">⚙️ Tech Chair</div>
    <h2 class="modal-title" id="nav-setup-title">gws CLI Setup Guide</h2>
    <div class="modal-body" id="modal-nav-setup-body">
      <p>The <strong>gws CLI</strong> connects the automation scripts to your Google Workspace account. Full step-by-step instructions are in <code>GWS_SETUP.md</code> in the public repo. Here's the condensed version:</p>
      <h3>1 — Google Cloud Console</h3>
      <ul>
        <li>Create a project → Enable <strong>Drive API</strong> + <strong>Gmail API</strong></li>
        <li>Credentials → OAuth 2.0 Client ID → <strong>Desktop app</strong> type</li>
        <li>Add <code>pir.devine.news@gmail.com</code> as a Test User on the OAuth consent screen</li>
        <li>Download JSON → save as <code>~/.config/gws/client_secret.json</code></li>
      </ul>
      <h3>2 — Authenticate</h3>
      <pre>gws auth login</pre>
      <p>Browser opens → sign in as <code>pir.devine.news@gmail.com</code> → grant Drive + Gmail access. Token stays local, never committed.</p>
      <h3>3 — Create the private config</h3>
      <p>Create <code>data/committee/config.env</code> (gitignored):</p>
      <pre>SUBMISSIONS_FOLDER_ID=your_folder_id_here
TEMPLATES_FOLDER_ID=your_folder_id_here
APPROVED_FOLDER_ID=your_folder_id_here
GOOGLE_ACCOUNT=pir.devine.news@gmail.com</pre>
      <p>Find a folder ID in the Drive URL after <code>/folders/</code>.</p>
      <h3>4 — Add the Drive URL to data.json</h3>
      <p>Copy the Submissions folder URL → add to <code>dashboard/data.json</code> → <code>driveUrl</code>. The Drive panel activates on the next push.</p>
      <h3>5 — Run the sync</h3>
      <pre>./scripts/gws-sync.sh</pre>
    </div>
    <div class="modal-actions">
      <a href="https://github.com/drasticstatic/pir-devine-news-public/blob/main/GWS_SETUP.md"
         target="_blank" rel="noopener" class="btn btn-primary">☁️ View GWS_SETUP.md ↗</a>
      <button class="btn btn-ghost" onclick="closeModal('modal-nav-setup')">Close</button>
    </div>
  </div>
</div>`;

  /* ── Inject nav before first element of body ──────────────── */
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* ── Inject setup modal at end of body ───────────────────── */
  document.body.insertAdjacentHTML('beforeend', setupModalHTML);

  /* ── Define openModal / closeModal if not already on page ── */
  if (!window.openModal) {
    window.openModal = function (id) {
      const el = document.getElementById(id);
      if (el) { el.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    };
    window.closeModal = function (id) {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('is-open'); document.body.style.overflow = ''; }
    };
    /* Close nav setup modal on outside click */
    document.addEventListener('click', function (e) {
      const modal = document.getElementById('modal-nav-setup');
      if (modal && modal.classList.contains('is-open') && e.target === modal) {
        window.closeModal('modal-nav-setup');
      }
    });
    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.is-open').forEach(function (o) {
          window.closeModal(o.id);
        });
      }
    });
  } else {
    /* openModal/closeModal already defined (index.html) — just wire outside-click */
    const setupModal = document.getElementById('modal-nav-setup');
    if (setupModal) {
      setupModal.addEventListener('click', function (e) {
        if (e.target === setupModal) window.closeModal('modal-nav-setup');
      });
    }
  }

  /* ── Hamburger toggle ─────────────────────────────────────── */
  const burger = document.getElementById('pir-nav-burger');
  const links  = document.getElementById('pir-nav-links');
  burger.addEventListener('click', function () {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* ── Close menu on nav-link click (mobile) ────────────────── */
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

  /* ── Drive link: update href from data.json ───────────────── */
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
    } catch (_) { /* silent */ }
  }
  updateDriveLinks();

  /* ── Global modal scroll nav — button in every .modal-actions ── */
  function initAllModalScrollNav() {
    document.querySelectorAll('.modal').forEach(function (modal) {
      const body    = modal.querySelector('.modal-body');
      const actions = modal.querySelector('.modal-actions');
      if (!body || !actions || modal.querySelector('.modal-scroll-btn') || modal.hasAttribute('data-no-scroll-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'modal-scroll-btn';
      btn.title = 'Jump to bottom / back to top';
      btn.textContent = '↓ Jump to bottom';

      /* Insert as first item in footer actions */
      actions.insertBefore(btn, actions.firstChild);

      let atBottom = false;
      btn.addEventListener('click', function () {
        if (atBottom) {
          body.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
        }
      });
      body.addEventListener('scroll', function () {
        atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 24;
        btn.textContent = atBottom ? '↑ Back to top' : '↓ Jump to bottom';
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllModalScrollNav);
  } else {
    initAllModalScrollNav();
  }

})();
