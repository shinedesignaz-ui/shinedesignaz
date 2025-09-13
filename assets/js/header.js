(() => {
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobile-nav');
  if (!btn || !menu) return;

  const openMenu = () => {
    menu.removeAttribute('hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = '✕';
  };
  const closeMenu = () => {
    menu.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '☰';
  };

  btn.addEventListener('click', () => {
    const isOpen = !menu.hasAttribute('hidden');
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('click', (e) => {
    if (!menu.hasAttribute('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  }, { passive: true });

  const mobileButtons = document.querySelectorAll('.mobile-dropdown > button');
  mobileButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = button.parentElement;
      const isOpen = parent.classList.contains('open');

      mobileButtons.forEach((b) => {
        b.parentElement.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        parent.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    }, { passive: true });
  });
})();
