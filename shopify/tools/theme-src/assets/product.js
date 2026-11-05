/* Veda Apothecary — product page (Shopify theme version).
   Gallery, quantity, one-time vs subscribe, add to cart, "Buy it now" -> Shopify checkout. */
(function () {
  'use strict';
  var root = document.querySelector('[data-product]');
  if (!root) return;
  var V = window.VEDA, cart = window.VedaCart, id = root.dataset.product, p = V.products[id];
  if (!p || !cart) return;
  var state = { sub: false, freq: 30, qty: 1 };
  var unit = function () { return p.price * (state.sub ? 1 - V.config.subOff : 1); };
  var main = document.getElementById('pdpMain');

  root.querySelectorAll('[data-thumb]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      root.querySelectorAll('[data-thumb]').forEach(function (b) { b.classList.toggle('on', b === btn); });
      var src = btn.dataset.thumb, img = btn.querySelector('img');
      main.src = src; main.alt = img.alt; main.width = img.width; main.height = img.height;
      main.className = /pouch/.test(src) ? 'pkimg' : /bowl/.test(src) ? 'cutimg' : 'photo';
      main.removeAttribute('srcset');
    });
  });

  var freq = document.getElementById('pdpFreq');
  var atc = document.getElementById('atc');
  var buy = root.querySelector('[data-pdp-buy]');
  function render() {
    var u = unit();
    document.getElementById('pp').textContent = cart.money(u);
    document.getElementById('pdpQty').textContent = state.qty;
    root.querySelectorAll('[data-opt]').forEach(function (o) { o.classList.toggle('on', (o.dataset.opt === 'sub') === state.sub); });
    if (freq) freq.hidden = !state.sub;
    if (p.available === false) {
      atc.textContent = 'Sold out'; atc.disabled = true; if (buy) buy.disabled = true;
    } else {
      atc.textContent = 'Add to cart — ' + cart.money(u * state.qty);
    }
  }
  root.querySelectorAll('input[name=po]').forEach(function (r) { r.addEventListener('change', function () { state.sub = r.value === 'sub'; render(); }); });
  if (freq) freq.addEventListener('change', function () { state.freq = +freq.value; });
  root.querySelectorAll('[data-qty]').forEach(function (b) { b.addEventListener('click', function () { state.qty = Math.max(1, state.qty + +b.dataset.qty); render(); }); });

  atc.addEventListener('click', function () { cart.add(id, state.qty, state.sub, state.freq).catch(function () {}); });
  if (buy) buy.addEventListener('click', function () {
    buy.disabled = true;
    cart.add(id, state.qty, state.sub, state.freq, true).then(function () { cart.checkout(); }, function () { buy.disabled = false; });
  });

  var sticky = document.getElementById('satc');
  if (sticky) {
    sticky.innerHTML = '<div class="wrap"><img src="' + p.img + '" alt="" width="40" height="56"><span class="nm">' + cart.esc(p.name) +
      '<br><span class="price" style="font-size:16px;color:var(--muted)">' + cart.money(p.price) + '</span></span><button class="btn sm" type="button" data-add="' + id + '"' + (p.available === false ? ' disabled' : '') + '>' + (p.available === false ? 'Sold out' : 'Add to cart') + '</button></div>';
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var e = en[0], show = !e.isIntersecting && e.boundingClientRect.top < 0;
        sticky.classList.toggle('on', show); sticky.inert = !show;
      }).observe(atc);
    }
  }
  render();
})();
