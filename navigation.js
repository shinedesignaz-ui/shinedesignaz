(() => {
  // Bump this when you update /partials/header.html or /partials/footer.html
  const VERSION = '3';
  const key = p => `chrome:${VERSION}:${p}`;

  /* 1) Ensure shared header CSS is present once */
  (function injectHeaderCSS() {
    const href = '/header-styles.css';
    const has = [...document.styleSheets].some(s => s.href && s.href.includes(href));
    if (!has) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  })();

  /* 2) Remove any legacy inline header/footer (old pages) */
  function removeLegacyChrome() {
    document.querySelectorAll('header.main-header, .micro-footer, footer')
      .forEach(el => el.parentNode && el.parentNode.removeChild(el));
  }

  /* 3) Ensure placeholders exist */
  function ensurePlaceholders() {
    // Skip link
    if (!document.querySelector('.sr-only[href="#main"]')) {
      const skip = document.createElement('a');
      skip.className = 'sr-only';
      skip.href = '#main';
      skip.textContent = 'Skip to content';
      document.body.insertBefore(skip, document.body.firstChild);
    }
    // Header slot
    if (!document.getElementById('site-header')) {
      const top = document.createElement('div');
      top.id = 'site-header';
      top.setAttribute('data-chrome-path', '/partials/header.html');
      document.body.insertBefore(top, document.body.firstChild.nextSibling);
    }
    // Footer slot
    if (!document.getElementById('site-footer')) {
      const bottom = document.createElement('div');
      bottom.id = 'site-footer';
      bottom.setAttribute('data-chrome-path', '/partials/footer.html');
      document.body.appendChild(bottom);
    }
  }

  /* 4) Fetch & mount helpers (cache-first for speed, version-busted) */
  async function mount(id, path, after) {
    const slot = document.getElementById(id);
    if (!slot) return;

    const cached = localStorage.getItem(key(path));
    if (cached) slot.outerHTML = cached;

    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) return;
      const html = await res.text();
      localStorage.setItem(key(path), html);
      (document.getElementById(id) || document.querySelector(`[data-chrome-path="${path}"]`))?.outerHTML = html;
      after && after();
    } catch {}
  }

  /* 5) Wire header interactions (menu toggle + mobile dropdowns) */
  function wireHeader() {
    const btn = document.querySelector('.menu-btn');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;

    const open = () => { menu.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); btn.textContent = '✕'; };
    const close = () => { menu.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); btn.textContent = '☰'; };

    btn.addEventListener('click', () => (!menu.hasAttribute('hidden') ? close() : open()));
    document.addEventListener('click', (e) => {
      if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) close();
    }, { passive: true });

    // Only one mobile dropdown open at a time
    document.querySelectorAll('.mobile-dropdown > button').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = b.parentElement;
        const on = parent.classList.contains('open');
        document.querySelectorAll('.mobile-dropdown').forEach(d => {
          d.classList.remove('open');
          d.querySelector('button')?.setAttribute('aria-expanded','false');
        });
        if (!on) { parent.classList.add('open'); b.setAttribute('aria-expanded','true'); }
      }, { passive: true });
    });
  }

  /* 6) Footer year token */
  function fixYear() {
    document.querySelectorAll('footer .small').forEach(el=>{
      el.innerHTML = el.innerHTML.replace('{year}', new Date().getFullYear());
    });
  }

  // Run
  removeLegacyChrome();
  ensurePlaceholders();
  mount('site-header', '/partials/header.html', wireHeader);
  mount('site-footer', '/partials/footer.html', fixYear);
})();
