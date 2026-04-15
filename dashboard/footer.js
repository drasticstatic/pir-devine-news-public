/**
 * footer.js — Devine News shared footer
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
        <a href="index.html">🏠 Committee Portal</a>
        <a href="submit.html">✍️ Submit Work</a>
        <a href="newsletter-template.html">📰 Newsletter Template</a>
        <a href="bulletin.html">📋 De Vine Bulletin</a>
        <a href="https://docs.google.com/document/d/1or5cB7Ij6BHj-GLm-6V-UeFSA0Re6QUfVaIoAT2rAgI/edit"
           target="_blank" rel="noopener">📅 Topics &amp; Deadlines</a>
      </div>

      <div class="pir-footer__group">
        <span class="pir-footer__group-title">PIR® Fellowship</span>
        <a href="https://www.psychedelicsinrecovery.org" target="_blank" rel="noopener">🌐 Main Site</a>
        <a href="https://www.psychedelicsinrecovery.org/member-materials/" target="_blank" rel="noopener">📚 Member Materials</a>
        <a href="https://www.psychedelicsinrecovery.org/meetings/" target="_blank" rel="noopener">🗓 Find a Meeting</a>
        <a href="https://www.psychedelicsinrecovery.org/12-steps/" target="_blank" rel="noopener">📜 The 12 Steps</a>
        </div>

        <div class="pir-footer__group">
        <span class="pir-footer__group-title">Media &amp; Committee</span>
        <a href="https://integrationradioapirpodcast.buzzsprout.com" target="_blank" rel="noopener">🎙 Integration Radio (Podcast)</a>
        <a href="https://www.youtube.com/@Psychedelicsinrecovery" target="_blank" rel="noopener">▶️ YouTube</a>
        <a href="https://www.facebook.com/PIR12and12" target="_blank" rel="noopener">📘 Facebook</a>
        <a href="https://service.psychedelicsinrecovery.org" target="_blank" rel="noopener">🔧 Service Subdomain</a>
        <a href="https://service.psychedelicsinrecovery.org/pr-committee/" target="_blank" rel="noopener">👥 PR Committee</a>
        <a href="https://service.psychedelicsinrecovery.org/literature" target="_blank" rel="noopener">📖 Literature Committee</a>
        </div>

        <div class="pir-footer__group">
        <span class="pir-footer__group-title">Tech &amp; Resources</span>
        <a href="https://github.com/drasticstatic/pir-devine-news-public" target="_blank" rel="noopener">💻 GitHub (Public Repo)</a>
        <a href="#drive" data-footer-drive>☁️ Google Drive</a>
        <a href="mailto:info@psychedelicsinrecovery.org">💌 General Inquiries</a>
        <a href="mailto:tech@psychedelicsinrecovery.org">🧑🏽‍💻 Tech Committee</a>
        <a href="mailto:newsletter@psychedelicsinrecovery.org">✉️ Contact Newsletter</a>
        <a href="mailto:pir.devine.news@gmail.com">🔐 Site Admin</a>
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
