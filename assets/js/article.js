/* Blog article: highlight the table-of-contents entry for the section being read. */
(function () {
  'use strict';
  var links = [].slice.call(document.querySelectorAll('.ba-toc a')); if (!links.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('on', l.dataset.t === e.target.id); }); }); }, { rootMargin: '-20% 0px -70% 0px' });
  links.forEach(function (l) { var t = document.getElementById(l.dataset.t); if (t) io.observe(t); });
  links[0].classList.add('on');
})();
