/* /cart/ page: renders the cart from localStorage. */
(function () {
  'use strict';
  var C = window.VedaCart, V = window.VEDA, host = document.getElementById('cartPage'); if (!host || !C) return;
  function paint() {
    var items = C.items();
    if (!items.length) { host.innerHTML = C.empty; return; }
    var st = C.subtotal();
    host.innerHTML = '<div class="card">' + C.lines() + C.shipBar() +
      '<div class="sum" style="margin-top:22px"><div><span>Subtotal</span><span>' + C.money(st) + '</span></div><div><span>Shipping</span><span>' + (st >= V.config.freeShip ? 'Free' : 'Calculated at checkout') + '</span></div></div>' +
      '<div style="display:flex;gap:12px;margin-top:26px;flex-wrap:wrap"><a class="btn ghost" href="/shop/">Continue shopping</a><button class="btn" style="flex:1" type="button" data-checkout>Checkout</button></div>' +
      '<p style="font-size:13px;color:var(--muted);margin:16px 0 0">Taxes and shipping are calculated at checkout. Questions? Call ' + '+1 (713) 770-6032' + '.</p></div>';
  }
  paint();
  window.addEventListener('veda:cart', paint);
})();
