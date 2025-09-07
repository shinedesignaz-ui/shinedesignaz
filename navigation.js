(function(){
  const btn = document.querySelector('.menu-btn');
  const mobile = document.getElementById('mobile-nav');
  if(!btn || !mobile) return;
  document.addEventListener('DOMContentLoaded', function() {
    document.body.style.padding = '0 16px';
  });
  btn.addEventListener('click', () => {
    const open = !mobile.hasAttribute('hidden');
    if(open){ mobile.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
    else { mobile.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
  });
})();