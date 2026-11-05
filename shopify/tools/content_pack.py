#!/usr/bin/env python3
"""Build an optional 'content for Shopify admin' pack (product import CSV, redirects CSV,
pages/blog list, product images). Not part of the theme and not committed.

Usage: python content_pack.py SRC_SITE AUX_DIR OUT_DIR PRODUCTS_MJS
  SRC_SITE     dist-shopify/ (Shopify-URL site build)
  AUX_DIR      folder with build-data.json written by convert.py
  OUT_DIR      where the pack is written
  PRODUCTS_MJS src/data/products.mjs (SKUs)"""
import csv, json, os, re, shutil, sys

SRC, AUX, C, PRODUCTS_MJS = sys.argv[1:5]
D = json.load(open(f'{AUX}/build-data.json', encoding='utf-8'))
os.makedirs(f'{C}/product-images', exist_ok=True)

seo = {(k, h): (t, d) for k, h, t, d in D['seo']}
TAGS = {'moringa-powder': 'Energy, Immunity', 'ashwagandha-powder': 'Calm, Strength', 'triphala-powder': 'Digestion',
        'amla-powder': 'Immunity'}
DISC = ('<p><em>*These statements have not been evaluated by the Food and Drug Administration. '
        'This product is not intended to diagnose, treat, cure, or prevent any disease.</em></p>')
rows = []
for h, p in D['products'].items():
    s = open(f'{SRC}/products/{h}/index.html', encoding='utf-8').read()
    m = re.search(r'<summary>Description</summary><div class="in">(.*?)</div></details>', s, re.S)
    body = re.sub(r'\sstyle="[^"]*"', '', m.group(1)).strip() + DISC
    t, d = seo[('product', h)]
    rows.append({
        'Handle': h, 'Title': p['name'], 'Body (HTML)': body, 'Vendor': 'Veda Apothecary', 'Product Category': '',
        'Type': 'Herbal Supplement', 'Tags': TAGS[h], 'Published': 'TRUE', 'Option1 Name': 'Title', 'Option1 Value': 'Default Title',
        'Variant SKU': p.get('sku', ''), 'Variant Grams': '227', 'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Qty': '0', 'Variant Inventory Policy': 'deny', 'Variant Fulfillment Service': 'manual',
        'Variant Price': f"{D['price'][h] / 100:.2f}", 'Variant Compare At Price': f"{D['compare'][h] / 100:.2f}" if h in D['compare'] else '',
        'Variant Requires Shipping': 'TRUE', 'Variant Taxable': 'TRUE', 'Image Src': '', 'SEO Title': t, 'SEO Description': d,
        'Status': 'active'})
    img = os.path.basename(p['img'])
    shutil.copy(f'{SRC}/assets/img/{img}', f'{C}/product-images/{h}--1-pouch{os.path.splitext(img)[1]}')
    short = h.split('-')[0]
    for i, kind in enumerate(['bowl', 'photo'], start=2):
        f = f'{SRC}/assets/img/{kind}-{short}.webp'
        if os.path.exists(f): shutil.copy(f, f'{C}/product-images/{h}--{i}-{kind}.webp')
# SKUs from the original product data
src_products = open(PRODUCTS_MJS, encoding='utf-8').read()
for r in rows:
    m = re.search(r"slug: '%s',.*?sku: '([^']+)'" % r['Handle'], src_products, re.S)
    if m: r['Variant SKU'] = m.group(1)
with open(f'{C}/1-products-import.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)

# redirects (old Vercel URLs -> Shopify URLs)
red = [('/shop', '/collections/all'), ('/blog', '/blogs/journal'), ('/shipping-returns', '/policies/shipping-policy'),
       ('/privacy-policy', '/policies/privacy-policy'), ('/terms-of-service', '/policies/terms-of-service')]
red += [(f'/{p}', f'/pages/{p}') for p in D['pages']]
red += [(f"/blog/{a['handle']}", f"/blogs/journal/{a['handle']}") for a in D['articles']]
red += [(f'/blog/category/{t}', f'/blogs/journal/tagged/{t}') for t in D['tags']]
with open(f'{C}/2-url-redirects-import.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['Redirect from', 'Redirect to']); w.writerows(red)

# collections, pages, blog posts to create by hand
TAGNAME = {'ayurveda-basics': 'Ayurveda Basics', 'botanicals': 'Botanicals', 'rituals-and-recipes': 'Rituals and Recipes', 'sourcing-and-quality': 'Sourcing and Quality'}
with open(f'{C}/3-collections-pages-blog.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['What', 'Title (type this)', 'Handle / URL (must match exactly)', 'Tags or products', 'Excerpt / note'])
    for c, prods in [('energy', 'Moringa Powder'), ('calm', 'Ashwagandha Powder'), ('digestion', 'Triphala Powder'), ('immunity', 'Amla Powder')]:
        w.writerow(['Collection', c.title(), c, prods, '"all" collection already exists in Shopify, do not create it'])
    for p in D['pages']:
        w.writerow(['Page', {'faq': 'FAQ'}.get(p, p.title()), p, '', 'Content can stay empty: the theme shows the designed page'])
    w.writerow(['Blog', 'Journal', 'journal', '', 'Online Store > Blog posts > Manage blogs'])
    for a in D['articles']:
        tag = TAGNAME.get(re.sub(r'[^a-z0-9]+', '-', a['tag'].lower().replace('&', 'and')).strip('-'), a['tag'])
        w.writerow(['Blog post', a['title'], a['handle'], tag, a['excerpt']])

print(open(f'{C}/3-collections-pages-blog.csv').read()[:1500])
print(len(rows), 'products', len(red), 'redirects')
