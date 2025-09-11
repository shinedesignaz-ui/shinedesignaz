// navigation.js - handles mobile menu toggle and active link highlighting

// mobile menu toggle
(function(){
  const btn = document.querySelector('.menu-btn');
  const mobile = document.getElementById('mobile-nav');
  if(!btn || !mobile) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    mobile.hidden = expanded;
  });
})();

// highlight current page link
(function(){
  const path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav-desktop a, .mobile-menu-items a').forEach(link => {
    const href = link.getAttribute('href');
    if(!href) return;
    const normalized = href.replace(/index\.html$/, '');
    if(normalized === path){
      link.classList.add('active');
    }
  });
})();
