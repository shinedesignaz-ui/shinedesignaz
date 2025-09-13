(() => {
  const VERSION = document.currentScript?.dataset?.chromeVersion || '1';
  const key = p => `chrome:${VERSION}:${p}`;

  async function mount(id, path, after) {
    const spot = document.getElementById(id);
    if (!spot) return;

    // cache-first
    const cached = localStorage.getItem(key(path));
    if (cached) spot.outerHTML = cached;

    // network update
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) return;
      const html = await res.text();
      localStorage.setItem(key(path), html);
      (document.getElementById(id) || document.querySelector(`[data-chrome-path="${path}"]`))?.outerHTML = html;
      after && after();
    } catch {}
  }

  function wireHeader() {
    const btn = document.querySelector('.menu-btn');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;

    const open = () => { menu.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); btn.textContent = '✕'; };
    const close = () => { menu.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); btn.textContent = '☰'; };

    btn.addEventListener('click', () => (!menu.hasAttribute('hidden') ? close() : open()));
    document.addEventListener('click', e => { if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) close(); }, { passive:true });

    // mobile dropdowns: one open at a time
    document.querySelectorAll('.mobile-dropdown > button').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const p = b.parentElement, on = p.classList.contains('open');
        document.querySelectorAll('.mobile-dropdown').forEach(d => { d.classList.remove('open'); d.querySelector('button')?.setAttribute('aria-expanded','false'); });
        if (!on) { p.classList.add('open'); b.setAttribute('aria-expanded','true'); }
      }, { passive:true });
    });
  }

  function fixYear() {
    document.querySelectorAll('footer .small').forEach(el => {
      el.innerHTML = el.innerHTML.replace('{year}', new Date().getFullYear());
    });
  }

  mount('site-header', '/partials/header.html', wireHeader);
  mount('site-footer', '/partials/footer.html', fixYear);
})();
