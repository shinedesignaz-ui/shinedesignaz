(function(){
  const btn = document.querySelector('.menu-btn');
  const mobile = document.getElementById('mobile-nav');
  if(!btn || !mobile) return;
  btn.addEventListener('click', () => {
    const open = !mobile.hasAttribute('hidden');
    if(open){ mobile.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
    else { mobile.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
  });
})();