// navigation.js 

// 1. MOBILE MENU TOGGLE
(function(){
  const btn = document.querySelector('.menu-btn');
  const mobile = document.getElementById('mobile-nav');
  if(!btn || !mobile) return;
  
  btn.addEventListener('click', () => {
    const open = !mobile.hasAttribute('hidden');
    if(open){ 
      mobile.setAttribute('hidden',''); 
      btn.setAttribute('aria-expanded','false'); 
    } else { 
      mobile.removeAttribute('hidden'); 
      btn.setAttribute('aria-expanded','true'); 
    }
  });
})();

// 2. FIELDD FORM LAZY LOADING
function loadFielddForm() {
  if (!window.FielddBooking) {
    var script = document.createElement('script');
    script.src = 'https://fieldd-scripts.s3.amazonaws.com/leadForm/fieldd-lead-form.js';
    script.onload = function() {
      if (window.FielddBooking && window.FielddBooking.init) {
        window.FielddBooking.init('I-HCZQ');
      }
    };
    document.body.appendChild(script);
  } else {
    window.FielddBooking.init('I-HCZQ');
  }
}

// Load Fieldd form when user scrolls to it
document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('fieldd-lead-form');
  if (form) {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        loadFielddForm();
        observer.disconnect();
      }
    });
    observer.observe(form);
  }
});

// 3. LOAD ACTION BUTTONS (Single external file approach)
(function() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
      const script = document.createElement('script');
      script.src = '/action-buttons.js';
      script.defer = true;
      document.body.appendChild(script);
    });
  } else {
    setTimeout(function() {
      const script = document.createElement('script');
      script.src = '/action-buttons.js';
      script.defer = true;
      document.body.appendChild(script);
    }, 1);
  }
})();