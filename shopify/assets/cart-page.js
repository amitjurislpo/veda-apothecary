/* Veda Apothecary — /cart page (Shopify theme version). */
(function () {
  'use strict';
  var cart = window.VedaCart, V = window.VEDA, box = document.getElementById('cartPage');
  if (!box || !cart) return;
  var all = (V.config.routes || {}).collectionsAll || '/collections/all';
  function render() {
    if (!cart.items().length) { box.innerHTML = cart.empty; return; }
    var s = cart.subtotal();
    box.innerHTML = '<div class="card">' + cart.lines() + cart.shipBar() +
      '<div class="sum" style="margin-top:22px"><div><span>Subtotal</span><span>' + cart.money(s) + '</span></div><div><span>Shipping</span><span>' + (s >= V.config.freeShip ? 'Free' : 'Calculated at checkout') + '</span></div></div>' +
      '<div style="display:flex;gap:12px;margin-top:26px;flex-wrap:wrap"><a class="btn ghost" href="' + all + '">Continue shopping</a><button class="btn" style="flex:1" type="button" data-checkout>Checkout</button></div>' +
      '<p style="font-size:13px;color:var(--muted);margin:16px 0 0">Taxes and shipping are calculated at checkout. Questions? Call +1 (713) 770-6032.</p></div>';
  }
  render();
  window.addEventListener('veda:cart', render);
})();
