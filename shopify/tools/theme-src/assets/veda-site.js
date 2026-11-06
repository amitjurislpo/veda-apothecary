/* Veda Apothecary — site behaviour for the Shopify theme.
   Same look and behaviour as the original site.js, but the cart is the real
   Shopify cart (AJAX API: /cart.js, /cart/add.js, /cart/change.js) and
   "Checkout" goes to Shopify's hosted checkout. */
(function () {
  'use strict';
  var V = window.VEDA || { products: {}, config: {}, search: [] };
  var C = V.config || {};
  var R = C.routes || { root: '/', cart: '/cart', cartAdd: '/cart/add', cartChange: '/cart/change', collectionsAll: '/collections/all' };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + Number(n).toFixed(2); };
  var nav = function (url) { if (window.VedaNavigate) window.VedaNavigate(url); else window.location.href = url; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- announcement bar ---------- */
  var ann = $('#announce');
  if (ann && ann.dataset.messages) {
    var msgs = [];
    try { msgs = JSON.parse(ann.dataset.messages); } catch (e) {}
    var mi = 0;
    if (msgs.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () { mi = (mi + 1) % msgs.length; ann.innerHTML = '<div><span>' + msgs[mi] + '</span></div>'; }, 4200);
    }
  }

  /* ---------- header, overlays ---------- */
  var hdr = $('#hdr');
  var onScroll = function () { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var scrim = $('#scrim'), drawer = $('#drawer'), search = $('#search'), mnav = $('#mnav');
  function syncScrim() { scrim.classList.toggle('on', drawer.classList.contains('on') || search.classList.contains('on')); }
  function menu(open) { mnav.classList.toggle('on', open); document.body.style.overflow = open ? 'hidden' : ''; }
  function openCart() { renderDrawer(); drawer.classList.add('on'); syncScrim(); var b = $('.dhead .icon-btn', drawer); if (b) b.focus(); }
  function closeAll() { drawer.classList.remove('on'); closeSearch(); menu(false); syncScrim(); }
  function openSearch() { search.classList.add('on'); syncScrim(); setTimeout(function () { $('#sq').focus(); }, 250); runSearch(''); }
  function closeSearch() { search.classList.remove('on'); syncScrim(); }
  scrim.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  function runSearch(q) {
    q = (q || '').toLowerCase().trim();
    var words = q.split(/\s+/).filter(Boolean);
    var hits = (V.search || []).filter(function (it) {
      return !words.length || words.every(function (w) { return it.k.indexOf(w) > -1 || it.t.toLowerCase().indexOf(w) > -1; });
    }).slice(0, 8);
    $('#sres').innerHTML = hits.length ? hits.map(function (it) {
      return '<a href="' + it.u + '">' + (it.img ? '<img src="' + it.img + '" alt="" width="56" height="78" loading="lazy">' : '') +
        '<span><b style="font-weight:500;font-family:var(--serif);font-size:17px">' + esc(it.t) + '</b><br><small style="color:var(--muted)">' + esc(it.s || '') + '</small></span></a>';
    }).join('') : '<p class="lead">No results for “' + esc(q) + '”.</p>';
  }
  $('#sq').addEventListener('input', function (e) { runSearch(e.target.value); });
  $('#sq').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.value.trim()) { nav(R.root.replace(/\/$/, '') + '/search?q=' + encodeURIComponent(e.target.value.trim())); }
  });

  /* ---------- Shopify cart ---------- */
  var byHandle = {};
  Object.keys(V.products || {}).forEach(function (id) { var p = V.products[id]; p.id = id; byHandle[p.handle] = p; });
  var cart = { items: [], item_count: 0, items_subtotal_price: 0 };

  function api(url, body) {
    var opt = { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' } };
    if (body) { opt.method = 'POST'; opt.body = JSON.stringify(body); }
    return fetch(url, opt).then(function (r) {
      return r.json().then(function (j) { if (!r.ok) throw j; return j; });
    });
  }
  function refresh() {
    return api(R.cart + '.js').then(function (c) { cart = c; afterChange(); return c; });
  }
  function afterChange(bump) {
    updateCount(bump);
    renderDrawer();
    window.dispatchEvent(new CustomEvent('veda:cart'));
  }
  function updateCount(bump) {
    var el = $('#cc'), n = cart.item_count || 0;
    if (!el) return;
    el.textContent = n; el.classList.toggle('on', n > 0);
    var btn = el.closest('button'); if (btn) btn.setAttribute('aria-label', 'Open cart, ' + n + (n === 1 ? ' item' : ' items'));
    if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  function planFor(p, freq) {
    var plans = p.plans || [];
    if (!plans.length) return null;
    var hit = plans.filter(function (pl) { return String(pl.name).indexOf(String(freq)) > -1; })[0];
    return (hit || plans[0]).id;
  }
  function add(id, qty, sub, freq, silent) {
    var p = V.products[id];
    if (!p || !p.variant) { toast('Sorry, this product is not available right now.'); return Promise.reject(); }
    var line = { id: p.variant, quantity: qty || 1 };
    if (sub) { var sp = planFor(p, freq || 30); if (sp) line.selling_plan = sp; }
    return api(R.cartAdd + '.js', { items: [line] }).then(function () {
      return api(R.cart + '.js');
    }).then(function (c) {
      cart = c; afterChange(true);
      if (!silent) toast('<img src="' + p.img + '" alt="" width="38" height="52"><span><b style="font-weight:500">' + esc(p.name) + '</b> added to cart <a href="#" data-cart="open">View cart</a></span>');
    }).catch(function (err) {
      toast(esc((err && (err.description || err.message)) || 'Could not add to cart. Please try again.'));
      throw err;
    });
  }
  function change(key, quantity) {
    return api(R.cartChange + '.js', { id: key, quantity: Math.max(0, quantity) }).then(function (c) { cart = c; afterChange(); });
  }
  function setQty(key, delta) {
    var it = cart.items.filter(function (i) { return i.key === key; })[0];
    if (it) change(key, it.quantity + delta);
  }
  function remove(key) { change(key, 0); }
  function subtotal() { return (cart.items_subtotal_price || cart.total_price || 0) / 100; }
  function count() { return cart.item_count || 0; }

  var toastTimer;
  function toast(html) {
    var t = $('#toast'); t.innerHTML = html; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('on'); }, 3200);
  }
  function shipBar() {
    var s = subtotal(), left = C.freeShip - s, pct = Math.min(100, s / C.freeShip * 100);
    return '<div class="ship-bar">' + (left > 0 ? 'You’re <b>' + money(left) + '</b> away from <b>free US shipping</b>' : '<b>You’ve unlocked free US shipping!</b>') +
      '<div class="bar"><i style="width:' + pct + '%"></i></div></div>';
  }
  function lineHtml(it) {
    var p = byHandle[it.handle];
    var img = p ? p.img : (it.image || '');
    var url = it.url || (p && p.url) || '#';
    var size = p ? '8 oz · 227 g' : esc(it.variant_title || '');
    var plan = it.selling_plan_allocation ? ' · <span style="color:var(--teal)">' + esc(it.selling_plan_allocation.selling_plan.name) + '</span>' : '';
    return '<div class="line"><a href="' + url + '"><img src="' + img + '" alt="' + esc(it.product_title) + '" width="80" height="110" style="--tint:#F2E8D8"></a><div><h5>' + esc(it.product_title) + '</h5><small>' + size + plan + '</small>' +
      '<div class="qty sm"><button type="button" aria-label="Decrease quantity" data-cq="' + it.key + '" data-d="-1">−</button><span>' + it.quantity + '</span><button type="button" aria-label="Increase quantity" data-cq="' + it.key + '" data-d="1">+</button></div>' +
      '<button class="rm" type="button" data-crm="' + it.key + '">Remove</button></div><div class="lp">' + money(it.final_line_price / 100) + '</div></div>';
  }
  function lines() { return (cart.items || []).map(lineHtml).join(''); }
  var EMPTY = '<div class="empty"><img src="' + ((V.assets || {}).mark || '') + '" alt="" width="170" height="145"><h3 class="h-display" style="font-size:30px">Your cart is empty</h3><p class="lead" style="margin:10px auto 26px">Begin your ritual with one of our four botanicals.</p><a class="btn" href="' + R.collectionsAll + '">Shop the collection</a></div>';
  function renderDrawer() {
    if (!drawer) return;
    var n = (cart.items || []).length;
    drawer.innerHTML = '<div class="dhead"><h3>Your cart <span style="font-family:var(--sans);font-size:15px;color:var(--muted)">(' + count() + ')</span></h3><button class="icon-btn" type="button" aria-label="Close cart" data-cart="close"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      (n ? shipBar() : '') + '<div class="dbody">' + (n ? lines() : EMPTY) + '</div>' +
      (n ? '<div class="dfoot"><div class="tot"><span>Subtotal</span><b>' + money(subtotal()) + '</b></div><small>Taxes and shipping calculated at checkout</small><button class="btn block" type="button" data-checkout style="margin-top:14px">Checkout</button><a class="btn ghost block" href="' + R.cart + '" style="margin-top:8px">View cart</a></div>' : '');
  }
  function checkout() { if (count()) nav(R.root.replace(/\/$/, '') + '/checkout'); }

  window.VedaCart = {
    add: add, setQty: setQty, remove: remove, refresh: refresh,
    items: function () { return cart.items || []; }, subtotal: subtotal, count: count,
    money: money, shipBar: shipBar, lines: lines, empty: EMPTY, checkout: checkout, toast: toast, esc: esc
  };

  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-add]'))) { e.preventDefault(); e.stopPropagation(); add(el.dataset.add, 1).catch(function () {}); return; }
    if ((el = e.target.closest('[data-cart]'))) { e.preventDefault(); if (el.dataset.cart === 'open') openCart(); else closeAll(); return; }
    if ((el = e.target.closest('[data-menu]'))) { menu(el.dataset.menu === 'open'); return; }
    if ((el = e.target.closest('[data-search]'))) { if (el.dataset.search === 'open') openSearch(); else closeSearch(); return; }
    if ((el = e.target.closest('[data-cq]'))) { setQty(el.dataset.cq, +el.dataset.d); return; }
    if ((el = e.target.closest('[data-crm]'))) { remove(el.dataset.crm); return; }
    if ((el = e.target.closest('[data-checkout]'))) { e.preventDefault(); checkout(); return; }
    if (e.target.closest('#mnav a')) menu(false);
    if (e.target.closest('#sres a')) closeAll();
  });

  /* ---------- reveal-on-scroll ---------- */
  (function () {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  })();

  /* product cards: show "Sold out" for anything Shopify says is unavailable */
  $$('[data-add]').forEach(function (b) {
    var p = V.products[b.dataset.add];
    if (p && p.available === false) { b.disabled = true; b.textContent = 'Sold out'; }
  });

  renderDrawer();
  refresh().catch(function () {});
})();
