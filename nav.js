(function () {
  var burger = document.querySelector('.topnav-burger');
  var nav = document.querySelector('.topnav-links');
  var dropdown = document.querySelector('.topnav-dropdown');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  if (dropdown) {
    var trigger = dropdown.querySelector('.topnav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.topnav-inner')) {
      if (nav) nav.classList.remove('open');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
      if (dropdown) dropdown.classList.remove('open');
    }
  });
}());
