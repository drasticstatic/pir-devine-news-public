/**
 * nav.js — De Vine News shared navigation
 * Dependency-free. Include at end of <body> on every dashboard page.
 *
 * Desktop (top-right, all in pir-nav__links):
 *   sidebar pages → Submit(CTA) · Portal · Setup · Links▾
 *   index         → Submit(CTA) · Setup · Links▾
 *   submit        → Portal(CTA) · Setup · Links▾
 *
 * Mobile pir-nav__actions (always visible, hidden on desktop):
 *   most pages → ✍️ Submit (green pill)
 *   submit     → 🏠 Portal (blue pill — distinct)
 *
 * Mobile hamburger (pir-nav__links dropdown):
 *   Portal + Setup in same row · Links▾
 */
(function () {

  /* ── Determine current page ──────────────────────────────── */
  const page         = (window.CURRENT_PAGE || '').toLowerCase();
  const isIndexPage  = (page === 'index'); /* empty string = edition page → sidebar rules */
  const isSubmitPage = page === 'submit';

  /* ── "Links ▾" dropdown ──────────────────────────────────── */
  /* Template / Bulletin / Topics & Deadlines live in the sidenav now */
  const NAV_MORE = [
    { href: 'admin.html', label: 'AI Admin Dashboard', icon: '🤖', internal: true, tooltip: 'AI-powered admin interface — showcase + committee tools' },
    { href: 'https://www.psychedelicsinrecovery.org',                         label: 'PIR® Main Site',                    icon: '🌐', tooltip: 'Main Psychedelics In Recovery website' },
    { href: 'https://service.psychedelicsinrecovery.org',                     label: 'PIR® Service Subdomain',            icon: '🔧', tooltip: 'PIR® Service Subdomain — committee resources and service calendar' },
    { href: 'https://service.psychedelicsinrecovery.org/pr-committee/',       label: 'Public Relations Committee',        icon: '👥', tooltip: 'PR Committee page on the service subdomain' },
    { href: 'https://service.psychedelicsinrecovery.org/literature',          label: 'Literature Committee',              icon: '📖', tooltip: 'Literature Committee page on the service subdomain' },
    { href: 'https://www.psychedelicsinrecovery.org/meetings/',               label: 'Find a Meeting',                    icon: '🗓', tooltip: 'Find an in-person or online PIR® meeting' },
    { href: 'https://www.psychedelicsinrecovery.org/member-materials/',       label: 'Member Materials',                  icon: '📚', tooltip: 'PIR® member resources & literature' },
    { href: 'https://www.psychedelicsinrecovery.org/12-steps/',               label: 'The 12 Steps of PIR®',              icon: '📜', tooltip: 'PIR® 12 Steps' },
    { href: 'https://integrationradioapirpodcast.buzzsprout.com',             label: 'Integration Radio — PIR® Podcast',  icon: '🎙', tooltip: 'Integration Radio: a PIR® Podcast' },
    { href: 'https://www.youtube.com/@Psychedelicsinrecovery',                label: 'YouTube @Psychedelicsinrecovery',   icon: '▶️', tooltip: 'PIR® YouTube channel' },
    { href: 'https://www.facebook.com/PIR12and12',                            label: 'Facebook /PIR12and12',              icon: '📘', tooltip: 'PIR® Facebook page' },
    { href: 'https://github.com/drasticstatic/pir-devine-news-public',        label: 'GitHub (Public Repository)',        icon: '💻', tooltip: 'Public repo — dashboard source & release notes' },
    { href: '#drive', label: 'Google Drive — pir.devine.news',                                                            icon: '☁️', tooltip: 'Committee Google Drive — set up after gws CLI init', driveLink: true },
  ];

  /* ── Build dropdown (NAV_MORE) link element ──────────────── */
  function buildLink(link, inDropdown) {
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
    const tip   = link.tooltip ? ` data-tooltip="${link.tooltip}"` : '';
    const act   = isActive ? ' nav-active' : '';
    const drive = link.driveLink ? ' data-drive-link' : '';
    return `<a href="${link.href}" class="nav-link${act}"${ext}${tip}${drive}>${link.icon} ${link.label}</a>`;
  }
  const moreHTML = NAV_MORE.map(l => buildLink(l, true)).join('\n');

  /* ── Desktop CTA — first item in pir-nav__links, hidden on mobile ── */
  /* Submit = green pill; Portal = blue pill (nav-cta-portal) */
  const desktopCTA = isSubmitPage
    ? `<a href="index.html" class="nav-link nav-cta-portal nav-desktop-only">🏠 Portal</a>`
    : `<a href="submit.html" class="nav-link nav-cta nav-desktop-only">✍️ Submit</a>`;

  /* ── Mobile CTA — pir-nav__actions, hidden on desktop ──────── */
  /* Portal gets a distinct blue pill (nav-cta-portal) on submit.html  */
  const mobileCTA = isSubmitPage
    ? `<a href="index.html" class="nav-link nav-cta-portal" id="pir-nav-action-btn">🏠 Portal</a>`
    : `<a href="submit.html" class="nav-link nav-cta" id="pir-nav-action-btn">✍️ Submit</a>`;

  /* ── Portal links in primary pair ───────────────────────────── */
  /* Desktop (nav-desktop-only): blue CTA on sidebar pages; hidden on index/submit.
     Mobile  (nav-desktop-hidden): always "News Portal" in hamburger, plain link. */
  const desktopPortal = (!isIndexPage && !isSubmitPage)
    ? `<a href="index.html" class="nav-link nav-cta-portal nav-desktop-only">🏠 Portal</a>`
    : '';
  const mobilePortal = `<a href="index.html" class="nav-link nav-desktop-hidden">🏠 News Portal</a>`;
  const setupBtn     = `<button class="nav-link nav-setup-btn" onclick="openModal('modal-nav-setup')" data-tooltip="gws CLI setup guide — connect Google Drive to GitHub">⚙️ Setup</button>`;

  /* ── Nav HTML ─────────────────────────────────────────────── */
  const navHTML = `
<nav class="pir-nav" id="pir-nav" role="navigation" aria-label="Main navigation">
  <div class="pir-nav__inner">

    <!-- ≡ Döner — LEFT, tablet+mobile only. Opens editions sidenav. -->
    <button class="pir-nav__doner" id="pir-nav-doner"
            aria-label="Toggle editions panel" aria-expanded="false" aria-controls="pir-sidenav">
      <span></span><span></span><span></span>
    </button>

    <!-- Brand -->
    <a href="index.html" class="pir-nav__brand">
      <img src="assets/logo-white.png" alt="PIR® Logo" class="pir-nav__logo" />
      <div>
        <span class="pir-nav__title">De Vine <em>News</em></span>
        <span class="pir-nav__sub">PIR® Newsletter</span>
      </div>
    </a>

    <!-- Mobile CTA — always visible on mobile, hidden on desktop -->
    <div class="pir-nav__actions">
      ${mobileCTA}
    </div>

    <!-- Nav links: desktop = horizontal row all top-right; mobile = hamburger dropdown -->
    <div class="pir-nav__links" id="pir-nav-links">
      ${desktopCTA}
      <div class="nav-primary-pair">
        ${desktopPortal}
        ${mobilePortal}
        ${setupBtn}
      </div>
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

    <!-- ☰ Hamburger — RIGHT, mobile only. Opens site-pages dropdown. -->
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
    /* Close döner / sidenav when hamburger opens */
    if (open) {
      const sn    = document.getElementById('pir-sidenav');
      const doner = document.getElementById('pir-nav-doner');
      if (sn)    { sn.classList.remove('is-open'); }
      if (doner) { doner.classList.remove('is-open'); doner.setAttribute('aria-expanded','false'); }
    }
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
