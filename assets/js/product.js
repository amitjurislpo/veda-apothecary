/* Product page: gallery, purchase options, quantity, add-to-cart and the sticky buy bar. */
(function () {
  'use strict';
  var root = document.querySelector('[data-product]'); if (!root) return;
  var V = window.VEDA, C = window.VedaCart, id = root.dataset.product, p = V.products[id];
  var $ = function (s) { return root.querySelector(s); };
  var state = { sub: false, freq: 30, qty: 1 };
  var unit = function () { return p.price * (state.sub ? 1 - V.config.subOff : 1); };

  /* gallery */
  var main = document.getElementById('pdpMain');
  root.querySelectorAll('[data-thumb]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll('[data-thumb]').forEach(function (x) { x.classList.toggle('on', x === b); });
      var src = b.dataset.thumb, im = b.querySelector('img');
      main.src = src; main.alt = im.alt; main.width = im.width; main.height = im.height;
      main.className = /pouch/.test(src) ? 'pkimg' : /bowl/.test(src) ? 'cutimg' : 'photo';
      main.removeAttribute('srcset');
    });
  });

  /* purchase options + qty */
  var freq = document.getElementById('pdpFreq');
  function paint() {
    var u = unit();
    document.getElementById('pp').textContent = C.money(u);
    document.getElementById('atc').textContent = 'Add to cart — ' + C.money(u * state.qty);
    document.getElementById('pdpQty').textContent = state.qty;
    root.querySelectorAll('[data-opt]').forEach(function (l) { l.classList.toggle('on', (l.dataset.opt === 'sub') === state.sub); });
    if (freq) freq.hidden = !state.sub;
  }
  root.querySelectorAll('input[name=po]').forEach(function (r) { r.addEventListener('change', function () { state.sub = r.value === 'sub'; paint(); }); });
  if (freq) freq.addEventListener('change', function () { state.freq = +freq.value; });
  root.querySelectorAll('[data-qty]').forEach(function (b) { b.addEventListener('click', function () { state.qty = Math.max(1, state.qty + +b.dataset.qty); paint(); }); });
  var addBtn = document.getElementById('atc');
  addBtn.addEventListener('click', function () { C.add(id, state.qty, state.sub, state.freq); });
  root.querySelector('[data-pdp-buy]').addEventListener('click', function () { C.add(id, state.qty, state.sub, state.freq, true); window.location.href = '/cart/'; });

  /* sticky buy bar once the main button scrolls out of view */
  var bar = document.getElementById('satc');
  bar.innerHTML = '<div class="wrap"><img src="' + p.img + '" alt="" width="40" height="56"><span class="nm">' + C.esc(p.name) + '<br><span class="price" style="font-size:16px;color:var(--muted)">' + C.money(p.price) + '</span></span><button class="btn sm" type="button" data-add="' + id + '">Add to cart</button></div>';
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { var e = es[0]; var show = !e.isIntersecting && e.boundingClientRect.top < 0; bar.classList.toggle('on', show); bar.inert = !show; }).observe(addBtn);
  }
  paint();
})();
