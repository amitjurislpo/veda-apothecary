/* Veda Apothecary — site-wide behaviour: header, menu, search, cart drawer, reveal, forms hooks. No dependencies. */
(function () {
  'use strict';
  var V = window.VEDA || { products: {}, config: {}, search: [] };
  var CFG = V.config || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  /* ---------- announcement bar ---------- */
  var ann = $('#announce');
  if (ann && ann.dataset.messages) {
    var msgs = []; try { msgs = JSON.parse(ann.dataset.messages); } catch (e) {}
    var ai = 0;
    if (msgs.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () { ai = (ai + 1) % msgs.length; ann.innerHTML = '<div><span>' + msgs[ai] + '</span></div>'; }, 4200);
    }
  }

  /* ---------- header ---------- */
  var hdr = $('#hdr');
  var onScroll = function () { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- overlays ---------- */
  var scrim = $('#scrim'), drawer = $('#drawer'), search = $('#search'), mnav = $('#mnav');
  function syncScrim() { scrim.classList.toggle('on', drawer.classList.contains('on') || search.classList.contains('on')); }
  function toggleMenu(o) { mnav.classList.toggle('on', o); document.body.style.overflow = o ? 'hidden' : ''; }
  function openCart() { renderDrawer(); drawer.classList.add('on'); syncScrim(); var c = $('.dhead .icon-btn', drawer); if (c) c.focus(); }
  function closeAll() { drawer.classList.remove('on'); closeSearch(); toggleMenu(false); syncScrim(); }
  function openSearch() { search.classList.add('on'); syncScrim(); setTimeout(function () { $('#sq').focus(); }, 250); doSearch(''); }
  function closeSearch() { search.classList.remove('on'); syncScrim(); }
  scrim.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* ---------- search (client-side over a small build-time index) ---------- */
  function doSearch(q) {
    q = (q || '').toLowerCase().trim();
    var words = q.split(/\s+/).filter(Boolean);
    var r = (V.search || []).filter(function (x) { return !words.length || words.every(function (w) { return x.k.indexOf(w) > -1 || x.t.toLowerCase().indexOf(w) > -1; }); }).slice(0, 8);
    $('#sres').innerHTML = r.length ? r.map(function (x) {
      return '<a href="' + x.u + '">' + (x.img ? '<img src="' + x.img + '" alt="" width="56" height="78" loading="lazy">' : '') + '<span><b style="font-weight:500;font-family:var(--serif);font-size:17px">' + esc(x.t) + '</b><br><small style="color:var(--muted)">' + esc(x.s || '') + '</small></span></a>';
    }).join('') : '<p class="lead">No results for “' + esc(q) + '”.</p>';
  }
  $('#sq').addEventListener('input', function (e) { doSearch(e.target.value); });

  /* ---------- cart ---------- */
  var KEY = 'veda-cart-v1';
  var cart = (store.get(KEY) || []).filter(function (l) { return V.products[l.id]; });
  var unit = function (l) { return V.products[l.id].price * (l.sub ? 1 - CFG.subOff : 1); };
  var subtotal = function () { return cart.reduce(function (s, l) { return s + unit(l) * l.qty; }, 0); };
  var count = function () { return cart.reduce(function (s, l) { return s + l.qty; }, 0); };
  function save() { store.set(KEY, cart); updateCount(); renderDrawer(); window.dispatchEvent(new CustomEvent('veda:cart')); }
  function updateCount(bump) {
    var el = $('#cc'), n = count(); if (!el) return;
    el.textContent = n; el.classList.toggle('on', n > 0);
    var btn = el.closest('button'); if (btn) btn.setAttribute('aria-label', 'Open cart, ' + n + (n === 1 ? ' item' : ' items'));
    if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  function add(id, qty, sub, freq, silent) {
    if (!V.products[id]) return;
    qty = qty || 1; freq = freq || 30;
    var key = id + (sub ? '-s' + freq : '');
    var ex = cart.filter(function (l) { return l.key === key; })[0];
    if (ex) ex.qty += qty; else cart.push({ key: key, id: id, qty: qty, sub: !!sub, freq: freq });
    save(); updateCount(true);
    if (!silent) {
      var p = V.products[id];
      toast('<img src="' + p.img + '" alt="" width="38" height="52"><span><b style="font-weight:500">' + esc(p.name) + '</b> added to cart <a href="#" data-cart="open">View cart</a></span>');
    }
  }
  function setQty(key, d) {
    var l = cart.filter(function (x) { return x.key === key; })[0]; if (!l) return;
    l.qty += d; if (l.qty <= 0) cart = cart.filter(function (x) { return x !== l; });
    save();
  }
  function removeLine(key) { cart = cart.filter(function (x) { return x.key !== key; }); save(); }
  var toastT;
  function toast(html) { var t = $('#toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 3200); }

  function shipBar() {
    var st = subtotal(), left = CFG.freeShip - st, pct = Math.min(100, st / CFG.freeShip * 100);
    return '<div class="ship-bar">' + (left > 0 ? 'You’re <b>' + money(left) + '</b> away from <b>free US shipping</b>' : '<b>You’ve unlocked free US shipping!</b>') + '<div class="bar"><i style="width:' + pct + '%"></i></div></div>';
  }
  function lines() {
    return cart.map(function (l) {
      var p = V.products[l.id];
      return '<div class="line"><a href="' + p.url + '"><img src="' + p.img + '" alt="' + esc(p.name) + '" width="80" height="110" style="--tint:#F2E8D8"></a>' +
        '<div><h5>' + esc(p.name) + '</h5><small>' + (p.bundle ? '4 × 8 oz' : '8 oz · 227 g') + (l.sub ? ' · <span style="color:var(--teal)">Every ' + l.freq + ' days, −10%</span>' : '') + '</small>' +
        '<div class="qty sm"><button type="button" aria-label="Decrease quantity" data-cq="' + l.key + '" data-d="-1">−</button><span>' + l.qty + '</span><button type="button" aria-label="Increase quantity" data-cq="' + l.key + '" data-d="1">+</button></div>' +
        '<button class="rm" type="button" data-crm="' + l.key + '">Remove</button></div><div class="lp">' + money(unit(l) * l.qty) + '</div></div>';
    }).join('');
  }
  var emptyHTML = '<div class="empty"><img src="/assets/img/mark.png" alt="" width="170" height="145"><h3 class="h-display" style="font-size:30px">Your cart is empty</h3><p class="lead" style="margin:10px auto 26px">Begin your ritual with one of our four botanicals.</p><a class="btn" href="/shop/">Shop the collection</a></div>';
  function renderDrawer() {
    var has = cart.length, hasSet = cart.some(function (l) { return l.id === 'ritual-set'; }), set = V.products['ritual-set'];
    drawer.innerHTML = '<div class="dhead"><h3>Your cart <span style="font-family:var(--sans);font-size:15px;color:var(--muted)">(' + count() + ')</span></h3><button class="icon-btn" type="button" aria-label="Close cart" data-cart="close"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      (has ? shipBar() : '') +
      '<div class="dbody">' + (has ? lines() + (hasSet || !set ? '' : '<div class="upsell"><img src="/assets/img/pouch-triphala.webp" alt="" width="40" height="56"><div><b style="font-weight:500">Make it the full ritual</b><br><small style="color:var(--muted)">All 4 botanicals for ' + money(set.price) + '</small></div><button class="btn sm" type="button" data-add="ritual-set">Add</button></div>') : emptyHTML) + '</div>' +
      (has ? '<div class="dfoot"><div class="tot"><span>Subtotal</span><b>' + money(subtotal()) + '</b></div><small>Taxes and shipping calculated at checkout</small><a class="btn block" href="/cart/">Review &amp; checkout</a></div>' : '');
  }

  /* hand-off to checkout (payment provider URL when configured, otherwise an order e-mail) */
  function orderText() {
    var t = 'Order request\n\n';
    cart.forEach(function (l) { var p = V.products[l.id]; t += l.qty + ' x ' + p.name + (l.sub ? ' (Subscribe & Save, every ' + l.freq + ' days)' : '') + ' - ' + money(unit(l) * l.qty) + '\n'; });
    t += '\nSubtotal: ' + money(subtotal()) + '\n\nName:\nShipping address:\nPhone:\n';
    return t;
  }
  function checkout() {
    if (!cart.length) return;
    if (CFG.checkoutUrl) { window.location.href = CFG.checkoutUrl; return; }
    window.location.href = 'mailto:' + CFG.orderEmail + '?subject=' + encodeURIComponent('Order request') + '&body=' + encodeURIComponent(orderText());
  }

  window.VedaCart = { add: add, setQty: setQty, remove: removeLine, items: function () { return cart; }, subtotal: subtotal, count: count, unit: unit, money: money, shipBar: shipBar, lines: lines, empty: emptyHTML, checkout: checkout, toast: toast, esc: esc, store: store };

  /* ---------- delegated clicks ---------- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-add]'))) { e.preventDefault(); e.stopPropagation(); add(t.dataset.add, 1); return; }
    if ((t = e.target.closest('[data-cart]'))) { e.preventDefault(); if (t.dataset.cart === 'open') openCart(); else closeAll(); return; }
    if ((t = e.target.closest('[data-menu]'))) { toggleMenu(t.dataset.menu === 'open'); return; }
    if ((t = e.target.closest('[data-search]'))) { if (t.dataset.search === 'open') openSearch(); else closeSearch(); return; }
    if ((t = e.target.closest('[data-cq]'))) { setQty(t.dataset.cq, +t.dataset.d); return; }
    if ((t = e.target.closest('[data-crm]'))) { removeLine(t.dataset.crm); return; }
    if ((t = e.target.closest('[data-checkout]'))) { e.preventDefault(); checkout(); return; }
    if (e.target.closest('#mnav a')) toggleMenu(false);
    if (e.target.closest('#sres a')) closeAll();
  });

  /* ---------- scroll reveal ---------- */
  function reveal() {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(e); });
  }
  reveal();

  /* ---------- newsletter ---------- */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-newsletter]'); if (!f) return;
    e.preventDefault();
    var email = f.querySelector('input[type=email]').value;
    var done = function () { f.innerHTML = '<p style="color:var(--ink);padding:14px 20px;margin:0">You’re in! Use code <b>VEDA10</b> at checkout.</p>'; };
    if (CFG.formEndpoint) {
      fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ form: 'newsletter', email: email }) }).then(done, done);
    } else {
      window.location.href = 'mailto:' + CFG.orderEmail + '?subject=' + encodeURIComponent('Newsletter signup') + '&body=' + encodeURIComponent('Please add me to the Veda Circle: ' + email); done();
    }
  });

  updateCount(); renderDrawer();
})();
