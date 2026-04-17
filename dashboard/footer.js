/**
 * footer.js — De Vine News shared footer
 * Dependency-free. Include at end of <body> on every dashboard page,
 * after nav.js. Injects a full-width footer before </body>.
 */
(function () {
  const footerHTML = `
<footer class="pir-footer" id="pir-footer">
  <div class="pir-footer__inner">

    <div class="pir-footer__brand">
      <a href="index.html" style="text-decoration:none;display:flex;align-items:center;gap:0.75rem">
        <img src="assets/logo-white.png" alt="PIR® Logo" class="pir-footer__logo" />
        <div>
          <span class="pir-footer__title">De Vine <em>News</em></span>
          <span class="pir-footer__copy">PIR® Newsletter<br/>Psychedelics in Recovery™</span>
        </div>
      </a>
      <p style="font-size:0.72rem;color:var(--text-3);line-height:1.7;margin-top:0.5rem;max-width:200px">
        Built &amp; maintained as committee service. No special expertise required — only
        a willingness to serve with humility.
      </p>
    </div>

    <nav class="pir-footer__links" aria-label="Footer navigation">

      <div class="pir-footer__group">
        <span class="pir-footer__group-title">Portal</span>
        <a href="index.html" data-tooltip="View all submissions &amp; committee tools">🏠 De Vine News Portal</a>
        <a href="submit.html" data-tooltip="Submit literature, art, or both for the newsletter">✍️ Submit Work</a>
        <a href="newsletter-template.html" data-tooltip="Browse all newsletter content categories">📰 Newsletter Template</a>
        <a href="bulletin.html" data-tooltip="Fellowship announcements &amp; open service positions">📋 De Vine Bulletin</a>
        <a href="https://docs.google.com/document/d/1or5cB7Ij6BHj-GLm-6V-UeFSA0Re6QUfVaIoAT2rAgI/edit"
           target="_blank" rel="noopener" data-tooltip="Monthly themes &amp; submission deadlines">📅 Topics &amp; Deadlines</a>
      </div>

      <div class="pir-footer__group">
        <span class="pir-footer__group-title">PIR® Fellowship</span>
        <a href="https://www.psychedelicsinrecovery.org" target="_blank" rel="noopener" data-tooltip="Main Psychedelics In Recovery website">🌐 PIR® Main Site</a>
        <a href="https://www.psychedelicsinrecovery.org/member-materials/" target="_blank" rel="noopener" data-tooltip="PIR® member resources &amp; literature">📚 Member Materials</a>
        <a href="https://www.psychedelicsinrecovery.org/meetings/" target="_blank" rel="noopener" data-tooltip="Find an in-person or online PIR® meeting">🗓 Find a Meeting</a>
        <a href="https://www.psychedelicsinrecovery.org/12-steps/" target="_blank" rel="noopener" data-tooltip="PIR® 12 Steps">📜 The 12 Steps of PIR®</a>
      </div>

      <div class="pir-footer__group">
        <span class="pir-footer__group-title">Media &amp; Committee</span>
        <a href="https://integrationradioapirpodcast.buzzsprout.com" target="_blank" rel="noopener" data-tooltip="Integration Radio: a PIR® Podcast on Buzzsprout">🎙 Integration Radio Podcast</a>
        <a href="https://www.youtube.com/@Psychedelicsinrecovery" target="_blank" rel="noopener" data-tooltip="PIR® YouTube channel">▶️ YouTube</a>
        <a href="https://www.facebook.com/PIR12and12" target="_blank" rel="noopener" data-tooltip="PIR® Facebook page">📘 Facebook</a>
        <a href="https://service.psychedelicsinrecovery.org" target="_blank" rel="noopener" data-tooltip="PIR® Service Subdomain — committee resources &amp; service calendar">🔧 Service Subdomain</a>
        <a href="https://service.psychedelicsinrecovery.org/pr-committee/" target="_blank" rel="noopener" data-tooltip="PR Committee page on the service subdomain">👥 Public Relations Committee</a>
        <a href="https://service.psychedelicsinrecovery.org/literature-committee/" target="_blank" rel="noopener" data-tooltip="Literature Committee page on the service subdomain">📖 Literature Committee</a>
      </div>

      <div class="pir-footer__group">
        <span class="pir-footer__group-title">Tech &amp; Resources</span>
        <a href="https://github.com/drasticstatic/pir-devine-news-public" target="_blank" rel="noopener" data-tooltip="Public repo — dashboard source &amp; release notes">💻 GitHub (Public Repo)</a>
        <a href="#drive" data-footer-drive data-tooltip="Committee Google Drive — pir.devine.news">☁️ Google Drive</a>
        <a href="mailto:info@psychedelicsinrecovery.org" data-tooltip="General questions about PIR®">ⓘ General Inquiries</a>
        <a href="mailto:tech@psychedelicsinrecovery.org" data-tooltip="Technical issues with this dashboard">🧑🏽‍💻 Tech Committee</a>
        <a href="mailto:newsletter@psychedelicsinrecovery.org" data-tooltip="Reach the newsletter committee">💌 Contact Newsletter</a>
        <a href="mailto:pir.devine.news@gmail.com" data-tooltip="Site administrator email">🔐 Site Admin</a>
      </div>

    </nav>
  </div>

  <div class="pir-footer__bottom">
    <span class="pir-footer__bottom-text">
      ©2026 Psychedelics in Recovery™ · PIR® · All Rights Reserved
    </span>
    <span class="pir-footer__bottom-text" style="color:var(--text-3)">
      Questions or bugs?
      <a href="https://github.com/drasticstatic/pir-devine-news-public/issues"
         target="_blank" rel="noopener" style="color:var(--green)">Open an issue ↗</a>
    </span>
  </div>
</footer>`;

  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* Update Drive link from data.json if available */
  async function updateFooterDriveLink() {
    try {
      const res  = await fetch('data.json?_=' + Date.now());
      const data = await res.json();
      if (!data.driveUrl) return;
      document.querySelectorAll('[data-footer-drive]').forEach(el => {
        el.href = data.driveUrl;
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.textContent = '☁️ Google Drive';
      });
    } catch (_) {}
  }
  updateFooterDriveLink();
})();
