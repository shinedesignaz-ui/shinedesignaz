(() => {
  const VERSION = '3';
  const key = (p) => `chrome:${VERSION}:${p}`;

  // Load header-styles.css once
  (function injectHeaderCSS() {
    const href = '/header-styles.css';
    const has = Array.from(document.styleSheets || []).some(s => s.href && s.href.includes(href));
    if (!has) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  })();

  // Remove any legacy header/footer
  function removeLegacyChrome() {
    document.querySelectorAll('header.main-header, .micro-footer, footer').forEach(el => el.remove());
  }

  // Ensure placeholders exist inside <body>
  function ensurePlaceholders() {
    if (!document.querySelector('.sr-only[href="#main"]')) {
      const skip = document.createElement('a');
      skip.className = 'sr-only';
      skip.href = '#main';
      skip.textContent = 'Skip to content';
      document.body.insertBefore(skip, document.body.firstChild);
    }
    if (!document.getElementById('site-header')) {
      const top = document.createElement('div');
      top.id = 'site-header';
      top.setAttribute('data-chrome-path', '/partials/header.html');
      document.body.insertBefore(top, document.body.firstChild.nextSibling);
    }
    if (!document.getElementById('site-footer')) {
      const bottom = document.createElement('div');
      bottom.id = 'site-footer';
      bottom.setAttribute('data-chrome-path', '/partials/footer.html');
      document.body.appendChild(bottom);
    }
  }

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
      const target = document.getElementById(id) || document.querySelector(`[data-chrome-path="${path}"]`);
      if (target) target.outerHTML = html;
      if (typeof after === 'function') after();
    } catch (e) {
      console.error('[navigation.js] fetch error', e);
    }
  }

  function wireHeader() {
    const btn = document.querySelector('.menu-btn');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;

    function open(){ menu.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); btn.textContent = '✕'; }
    function close(){ menu.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); btn.textContent = '☰'; }

    btn.addEventListener('click', function(){
      if (menu.hasAttribute('hidden')) { open(); } else { close(); }
    });

    document.addEventListener('click', function(e){
      if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) close();
    }, { passive: true });

    document.querySelectorAll('.mobile-dropdown > button').forEach(function(b){
      b.addEventListener('click', function(e){
        e.stopPropagation();
        const parent = b.parentElement;
        const on = parent.classList.contains('open');
        document.querySelectorAll('.mobile-dropdown').forEach(function(d){
          d.classList.remove('open');
          const db = d.querySelector('button');
          if (db) db.setAttribute('aria-expanded','false');
        });
        if (!on) { parent.classList.add('open'); b.setAttribute('aria-expanded','true'); }
      }, { passive: true });
    });
  }

  function fixYear() {
    document.querySelectorAll('footer .small').forEach(function(el){
      el.innerHTML = el.innerHTML.replace('{year}', new Date().getFullYear());
    });
  }

  console.log('[navigation.js] loaded');
  removeLegacyChrome();
  ensurePlaceholders();
  mount('site-header', '/partials/header.html', wireHeader);
  mount('site-footer', '/partials/footer.html', fixYear);
})();