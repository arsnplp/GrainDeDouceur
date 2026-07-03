(function () {
  var groups = document.querySelectorAll('.detail-group');
  if (!groups.length) return;

  groups.forEach(function (group, idx) {
    var header = group.querySelector(':scope > strong, :scope > h2');
    if (!header) return;

    // Wrap everything after <strong> in .accordion-body
    var body = document.createElement('div');
    body.className = 'accordion-body';
    var children = Array.prototype.slice.call(group.children);
    children.forEach(function (child) {
      if (child !== header) body.appendChild(child);
    });
    group.appendChild(body);

    // Make header a button
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');

    function toggle() {
      var isOpen = group.classList.toggle('open');
      header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

  });
}());
