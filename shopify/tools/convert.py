#!/usr/bin/env python3
"""Convert the Veda Apothecary static site (Shopify-URL preview build) into a
Shopify Online Store 2.0 theme.

Usage: python convert.py SRC_SITE OUT_THEME AUX_DIR
  SRC_SITE  output of `VEDA_TARGET=shopify node build.mjs` (dist-shopify/)
  OUT_THEME folder that receives snippets/ and sections/ (called by shopify/tools/build.mjs)
  AUX_DIR   scratch folder for build-data.json and policy HTML (not part of the theme)"""
import json, os, re, shutil, sys, html as htmlmod

SRC, OUT, AUX = sys.argv[1], sys.argv[2], sys.argv[3]
LOG = []

ID2H = {'moringa': 'moringa-powder', 'ashwagandha': 'ashwagandha-powder',
        'triphala': 'triphala-powder', 'amla': 'amla-powder'}
H2ID = {v: k for k, v in ID2H.items()}

catalog_src = open(f'{SRC}/assets/js/catalog.js').read()
VEDA = json.loads(catalog_src[catalog_src.find('=') + 1:].strip().rstrip(';'))
PRICE = {ID2H[k]: round(v['price'] * 100) for k, v in VEDA['products'].items()}
COMPARE = {ID2H[k]: round(v['compare'] * 100) for k, v in VEDA['products'].items() if v['compare']}


def read(p):
    return open(os.path.join(SRC, p), encoding='utf-8').read()


def write(p, s):
    p = os.path.join(OUT, p)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(s)


def write_aux(p, s):
    p = os.path.join(AUX, p)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(s)


def part(s, a, b):
    i = s.find(a)
    j = s.find(b, i)
    assert i > -1 and j > -1, (a, b)
    return s[i:j + len(b)]


# ---------------------------------------------------------------- converters
ASSET_ABS = re.compile(r'https://vedaapothecaryusa\.com/assets/(?:img|fonts|css|js)/([\w.-]+)')
ASSET_REL = re.compile(r'/assets/(?:img|fonts|css|js)/([\w.-]+?)(?:\?v=\w+)?(?=["\'\s),])')
ABS_URL = re.compile(r'(https://vedaapothecaryusa\.com/[\w/#-]*?)/(?=["#])')
HREF = re.compile(r'(href|action)="(/[^"#?]*?)/((?:[#?][^"]*)?)"')


def assets(s):
    s = ASSET_ABS.sub(lambda m: "https:{{ '%s' | asset_url }}" % m.group(1), s)
    s = ASSET_REL.sub(lambda m: "{{ '%s' | asset_url }}" % m.group(1), s)
    return s


def links(s):
    s = s.replace('/policies/shipping-policy/#returns', '/policies/refund-policy')
    s = HREF.sub(lambda m: f'{m.group(1)}="{m.group(2) or "/"}{m.group(3)}"', s)
    s = ABS_URL.sub(lambda m: m.group(1), s)
    s = s.replace('href="/account/login"', 'href="{{ routes.account_url }}"')
    s = re.sub(r'vedaapothecaryusa\.com%2Fblog%2F([\w-]+)%2F', r'vedaapothecaryusa.com%2Fblogs%2Fjournal%2F\1', s)
    return s


def money_expr(h, kind):
    p = f"all_products['{h}']"
    if kind == 'price':
        return '{{ %s.price | money }}' % p
    if kind == 'sub':
        return '{{ %s.price | times: 0.9 | round | money }}' % p
    return '{{ %s.compare_at_price | default: %d | money }}' % (p, COMPARE.get(h, 0))


def num_expr(h, kind):
    p = f"all_products['{h}']"
    if kind == 'price':
        return '{{ %s.price | money_without_currency | remove: \',\' }}' % p
    if kind == 'sub':
        return '{{ %s.price | times: 0.9 | round | money_without_currency | remove: \',\' }}' % p
    return '{{ %s.compare_at_price | default: %d | money_without_currency | remove: \',\' }}' % (p, COMPARE.get(h, 0))


MARKER = re.compile(r'data-(?:add|product|pdp-add|pdp-buy|k)="([\w-]+)"|/products/([\w-]+)')


def kinds_for(cents):
    out = []
    for h, p in PRICE.items():
        if cents == p: out.append((h, 'price'))
        if cents == round(p * 0.9): out.append((h, 'sub'))
    for h, c in COMPARE.items():
        if cents == c: out.append((h, 'compare'))
    return out


def prices(s, where):
    """Replace hard-coded product prices with live Shopify prices."""
    def resolve(pos, cents):
        cands = kinds_for(cents)
        if not cands:
            return None
        last = None
        for m in MARKER.finditer(s, 0, pos):
            last = m
        h = None
        if last:
            h = last.group(2) or ID2H.get(last.group(1))
        for ch, kind in cands:
            if ch == h:
                return ch, kind
        hs = {c[0] for c in cands}
        if len(hs) == 1:
            return cands[0]
        LOG.append(f'UNRESOLVED price {cents/100:.2f} in {where} near {s[max(0,pos-80):pos]!r}')
        return None

    out, i = [], 0
    for m in re.finditer(r'\$(\d+\.\d\d)|"price":"(\d+\.\d\d)"', s):
        cents = round(float(m.group(1) or m.group(2)) * 100)
        r = resolve(m.start(), cents)
        if not r:
            continue
        out.append(s[i:m.start()])
        out.append(money_expr(*r) if m.group(1) else '"price":"%s"' % num_expr(*r))
        i = m.end()
    out.append(s[i:])
    return ''.join(out)


def main_of(page):
    s = read(page)
    m = s[s.find('<main id="main">') + len('<main id="main">'):s.rfind('</main>')]
    lds = re.findall(r'<script type="application/ld\+json">.*?</script>', s[:s.find('<body')], re.S)
    return m, lds, s


def convert(markup, where):
    assert '{{' not in markup and '{%' not in markup, where
    return links(prices(assets(markup), where))


def contact_forms(s):
    # contact + wholesale -> Shopify contact form
    def repl(m):
        kind = m.group(1)
        body = m.group(2)
        body = body.replace('name="name"', 'name="contact[name]"').replace('name="email"', 'name="contact[email]"')
        body = body.replace('name="message"', 'name="contact[body]"')
        body = re.sub(r'name="(?!contact\[)([\w-]+)"', r'name="contact[\1]"', body)
        ok = ('<div class="empty"><div class="success" style="padding:0"><div class="tick"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg></div></div>'
              '<h2 class="h-display" style="font-size:32px">Message received</h2><p class="lead" style="margin:10px auto 0">Thank you — our team will get back to you shortly.</p></div>')
        return ("{%% form 'contact', class: 'card', id: '%s-form' %%}"
                '<input type="hidden" name="contact[form]" value="%s">'
                '{%% if form.posted_successfully? %%}%s{%% else %%}'
                '{%% if form.errors %%}<p class="form-note">{{ form.errors | default_errors }}</p>{%% endif %%}'
                '%s{%% endif %%}{%% endform %%}') % (kind, kind, ok, body)
    return re.sub(r'<form class="card" data-form="(\w+)" novalidate>(.*?)</form>', repl, s, flags=re.S)


def newsletter_forms(s):
    def repl(m):
        attrs, body = m.group(1), m.group(2)
        style = re.search(r'style="([^"]*)"', attrs)
        body = re.sub(r'<input([^>]*type="email"[^>]*)>',
                      lambda x: '<input' + re.sub(r'\sname="[^"]*"', '', x.group(1)) + ' name="contact[email]">', body)
        return ("{%% form 'customer', class: 'nl-form' %%}"
                '<input type="hidden" name="contact[tags]" value="newsletter">'
                '{%% if form.posted_successfully? %%}<p style="color:var(--ink);padding:14px 20px;margin:0">You’re in! Use code <b>VEDA10</b> at checkout.</p>'
                '{%% else %%}%s{%% endif %%}{%% endform %%}') % (body,)
    return re.sub(r'<form([^>]*)data-newsletter>(.*?)</form>', repl, s, flags=re.S)


def subscription_guard(s, h):
    return re.sub(r'(<label class="opt" data-opt="sub">.*?</label>)',
                  "{%% if all_products['%s'].selling_plan_groups.size > 0 %%}\\1{%% endif %%}" % h, s, count=1, flags=re.S)


SCHEMA = '\n{%% schema %%}\n%s\n{%% endschema %%}\n'


def schema(name, extra=None):
    d = {'name': name, 'settings': []}
    if extra: d.update(extra)
    return SCHEMA % json.dumps(d, indent=2)


# ---------------------------------------------------------------- pages
pages = {}
for root, _, files in os.walk(SRC):
    for f in files:
        if f.endswith('.html'):
            rel = os.path.relpath(os.path.join(root, f), SRC)
            pages[rel] = True


def snippet_from(page, name):
    m, lds, full = main_of(page)
    ld = '\n'.join(lds)
    body = convert(ld + '\n' + m, page)
    write(f'snippets/{name}.liquid', body.strip() + '\n')
    return full


SEO = []


def seo(page, kind, handle):
    s = read(page)
    t = re.search(r'<title>(.*?)</title>', s).group(1)
    d = re.search(r'<meta name="description" content="(.*?)">', s)
    SEO.append([kind, handle, htmlmod.unescape(t), htmlmod.unescape(d.group(1)) if d else ''])


# products
for h in ID2H.values():
    snippet_from(f'products/{h}/index.html', f'pdp-{h}')
    p = f'{OUT}/snippets/pdp-{h}.liquid'
    s = subscription_guard(open(p, encoding='utf-8').read(), h)
    open(p, 'w', encoding='utf-8').write(s)
    seo(f'products/{h}/index.html', 'product', h)

# collections
COLS = ['all', 'energy', 'calm', 'digestion', 'immunity']
for c in COLS:
    snippet_from(f'collections/{c}/index.html', f'collection-{c}')
    seo(f'collections/{c}/index.html', 'collection', c)

# pages
PAGES = ['about', 'faq', 'contact', 'wholesale', 'accessibility']
for pg in PAGES:
    snippet_from(f'pages/{pg}/index.html', f'page-{pg}')
    p = f'{OUT}/snippets/page-{pg}.liquid'
    s = contact_forms(open(p, encoding='utf-8').read())
    open(p, 'w', encoding='utf-8').write(s)
    seo(f'pages/{pg}/index.html', 'page', pg)

# blog
snippet_from('blogs/journal/index.html', 'blog-journal')
seo('blogs/journal/index.html', 'blog', 'journal')
TAGS = sorted(os.listdir(f'{SRC}/blogs/journal/tagged'))
for t in TAGS:
    snippet_from(f'blogs/journal/tagged/{t}/index.html', f'blog-tag-{t}')
ARTICLES = sorted(d for d in os.listdir(f'{SRC}/blogs/journal') if d not in ('tagged', 'index.html'))
ART_META = []
for a in ARTICLES:
    full = snippet_from(f'blogs/journal/{a}/index.html', f'article-{a}')
    seo(f'blogs/journal/{a}/index.html', 'article', a)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', full, re.S).group(1)
    ld = re.search(r'"@type":"BlogPosting".*?"datePublished":"([\d-]+)"', full)
    cat = re.search(r'"articleSection":"([^"]+)"', full)
    desc = re.search(r'<meta name="description" content="(.*?)">', full).group(1)
    ART_META.append({'handle': a, 'title': htmlmod.unescape(re.sub('<[^>]+>', '', h1)),
                     'date': ld.group(1) if ld else '', 'tag': htmlmod.unescape(cat.group(1)) if cat else '',
                     'excerpt': htmlmod.unescape(desc)})

# home, cart, 404
home_m, home_ld, home_full = main_of('index.html')
home = convert('\n'.join(home_ld) + '\n' + home_m, 'index.html')
home = newsletter_forms(home)
write('sections/main-home.liquid', home.strip() + '\n' + schema('Veda home page'))
seo('index.html', 'home', '')

cart_m, _, _ = main_of('cart/index.html')
write('sections/main-cart.liquid', convert(cart_m, 'cart').strip() + '\n' + schema('Veda cart'))
nf_m, _, _ = main_of('404.html')
write('sections/main-404.liquid', convert(nf_m, '404').strip() + '\n' + schema('Veda 404'))

# policies: clean HTML to paste into Shopify admin (Settings > Policies)
def prose(page):
    m, _, _ = main_of(page)
    i = m.find('class="wrap narrow prose"')
    i = m.find('>', i) + 1
    j = m.find('</div></section>', i)
    body = links(m[i:j]).strip()
    body = re.sub(r'<p class="meta">.*?</p>', '', body)
    return body.strip()
POL = {}
POL['privacy-policy'] = prose('policies/privacy-policy/index.html')
POL['terms-of-service'] = prose('policies/terms-of-service/index.html')
ship = prose('policies/shipping-policy/index.html')
a = ship.find('<h2 id="returns"') if '<h2 id="returns"' in ship else ship.find('<h2>Returns')
b = ship.find('<h2', ship.find('Damaged or incorrect items') + 1)
if a > -1 and b > -1:
    POL['refund-policy'] = ship[a:b].strip()
    POL['shipping-policy'] = (ship[:a] + ship[b:]).strip()
else:
    POL['shipping-policy'] = ship
for k, v in POL.items():
    write_aux(f'policies/{k}.html', v + '\n')

# ---------------------------------------------------------------- header / footer
idx = read('index.html')
hdr = part(idx, '<div class="announce"', '</header>')
mnav = part(idx, '<div class="mobile-nav"', '</div>\n<div class="search"')[:-len('<div class="search"')]
srch = part(idx, '<div class="search" id="search"', '<main id="main">')[:-len('<main id="main">')]
header = convert(hdr + '\n' + mnav + srch, 'header')
header = header.replace('href="/pages/contact" aria-label="Contact"', 'href="{{ routes.account_url }}" aria-label="Account"')
header = header.replace('aria-label="Open cart, 0 items"', 'aria-label="Open cart, {{ cart.item_count }} items"')
header = header.replace('<span class="cart-count" id="cc" aria-hidden="true">0</span>',
                        '<span class="cart-count{% if cart.item_count > 0 %} on{% endif %}" id="cc" aria-hidden="true">{{ cart.item_count }}</span>')
ACTIVE = {
    'shop': "template.name == 'collection' or template.name == 'list-collections' or template.name == 'product'",
    'blog': "template.name == 'blog' or template.name == 'article'",
    'about': "template.name == 'page' and page.handle == 'about'",
    'wholesale': "template.name == 'page' and page.handle == 'wholesale'",
}
for k, cond in ACTIVE.items():
    header = header.replace(f'data-nav="{k}">', f'data-nav="{k}"{{% if {cond} %}} class="active" aria-current="page"{{% endif %}}>')
write('sections/header.liquid', header.strip() + '\n' + schema('Header'))

ftr = part(idx, '<footer class="site" id="ftr">', '</footer>')
footer = convert(ftr, 'footer').replace('© 2026', "© {{ 'now' | date: '%Y' }}")
write('sections/footer.liquid', footer.strip() + '\n' + schema('Footer'))

# ---------------------------------------------------------------- VEDA data snippet
def ajs(path):
    m = re.match(r'/assets/(?:img|fonts)/([\w.-]+)$', path or '')
    return "{{ '%s' | asset_url | json }}" % m.group(1) if m else json.dumps(path)


lines = ['<script>', 'window.VEDA = {',
         '  config: {',
         '    freeShip: %s, subOff: %s,' % (VEDA['config']['freeShip'], VEDA['config']['subOff']),
         "    orderEmail: {{ shop.email | json }}, wholesaleEmail: \"billing@vedaapothecaryusa.com\",",
         '    routes: { root: {{ routes.root_url | json }}, cart: {{ routes.cart_url | json }}, cartAdd: {{ routes.cart_add_url | json }}, cartChange: {{ routes.cart_change_url | json }}, collectionsAll: {{ routes.all_products_collection_url | json }} },',
         "    moneyFormat: {{ shop.money_format | json }}",
         '  },',
         '  assets: { mark: %s },' % ajs('/assets/img/mark.png'),
         '  order: %s,' % json.dumps(VEDA['order']),
         '  products: {']
for pid, p in VEDA['products'].items():
    h = ID2H[pid]
    ap = f"all_products['{h}']"
    fields = []
    for k, v in p.items():
        if k in ('price', 'compare', 'url'):
            continue
        fields.append(f'{json.dumps(k)}: {ajs(v) if isinstance(v, str) and v.startswith("/assets/") else json.dumps(v)}')
    fields += [
        '"handle": %s' % json.dumps(h),
        '"url": {{ %s.url | default: "/products/%s" | json }}' % (ap, h),
        '"price": {{ %s.price | default: %d | divided_by: 100.0 }}' % (ap, PRICE[h]),
        '"compare": {{ %s.compare_at_price | default: %d | divided_by: 100.0 }}' % (ap, COMPARE.get(h, 0)),
        '"variant": {{ %s.selected_or_first_available_variant.id | json }}' % ap,
        '"available": {{ %s.available | json }}' % ap,
        '"plans": [{%% for g in %s.selling_plan_groups %%}{%% for sp in g.selling_plans %%}{"id": {{ sp.id | json }}, "name": {{ sp.name | json }}}{%% unless forloop.last %%},{%% endunless %%}{%% endfor %%}{%% unless forloop.last %%},{%% endunless %%}{%% endfor %%}]' % ap,
    ]
    lines.append('    %s: { %s },' % (json.dumps(pid), ', '.join(fields)))
lines[-1] = lines[-1].rstrip(',')
lines.append('  },')
search = []
for e in VEDA['search']:
    e = dict(e)
    u = e['u']
    e['u'] = u[:-1] if u.endswith('/') and u != '/' else u
    if e.get('s', '').startswith('$'):
        h = e['u'].split('/')[-1]
        e['s'] = '@@PRICE:%s@@' % h
    item = json.dumps(e, ensure_ascii=False)
    item = re.sub(r'"@@PRICE:([\w-]+)@@"', lambda m: "{{ all_products['%s'].price | money | json }}" % m.group(1), item)
    if e.get('img'):
        item = item.replace(json.dumps(e['img']), ajs(e['img']))
    search.append('    ' + item)
lines.append('  search: [\n' + ',\n'.join(search) + '\n  ]')
lines.append('};')
lines.append('</script>')
write('snippets/veda-data.liquid', '\n'.join(lines) + '\n')

# ---------------------------------------------------------------- write summary data for other builders
write_aux('build-data.json', json.dumps({
    'products': {ID2H[k]: v for k, v in VEDA['products'].items()}, 'price': PRICE, 'compare': COMPARE,
    'policies': POL, 'collections': COLS, 'pages': PAGES, 'tags': TAGS, 'articles': ART_META, 'seo': SEO,
}, indent=1, ensure_ascii=False))

print('\n'.join(LOG) or 'no unresolved prices')
print('articles', len(ART_META), 'tags', TAGS)
