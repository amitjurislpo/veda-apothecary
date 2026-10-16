/* Contact + wholesale forms. Posts to the configured endpoint; otherwise opens a pre-filled e-mail. */
(function () {
  'use strict';
  var CFG = (window.VEDA || {}).config || {};
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var kind = form.dataset.form, data = {}, note = form.querySelector('[data-form-note]');
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.form = kind;
      var thanks = function () {
        form.innerHTML = '<div class="empty"><div class="success" style="padding:0"><div class="tick"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg></div></div><h2 class="h-display" style="font-size:32px">Message received</h2><p class="lead" style="margin:10px auto 0">Thank you — our team will get back to you shortly.</p></div>';
      };
      if (CFG.formEndpoint) {
        fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); thanks(); })
          .catch(function () { if (note) note.textContent = 'Sorry, something went wrong. Please email us directly.'; });
      } else {
        var to = kind === 'wholesale' ? CFG.wholesaleEmail : CFG.orderEmail;
        var body = Object.keys(data).filter(function (k) { return k !== 'form'; }).map(function (k) { return k + ': ' + data[k]; }).join('\n');
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent((kind === 'wholesale' ? 'Wholesale enquiry' : 'Website enquiry') + ' — ' + (data.name || '')) + '&body=' + encodeURIComponent(body);
        if (note) note.textContent = 'Your email app should open with your message ready to send.';
      }
    });
  });
})();
