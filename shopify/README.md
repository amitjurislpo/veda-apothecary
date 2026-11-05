# Veda Apothecary — Shopify theme (`shopify/`)

Online Store 2.0 theme for **iqvsus-db.myshopify.com**. It is generated from the same source as the
Vercel site (`src/`, `assets/`, `build.mjs`), so content and design changes only need to be made once.

Only these 4 products exist: **Moringa, Ashwagandha, Triphala, Amla**.

```
shopify/
  assets/ config/ layout/ locales/ sections/ snippets/ templates/   <- theme (GENERATED, committed)
  tools/                                                            <- generator, not uploaded to Shopify
    build.mjs        orchestrates `npm run build:shopify`
    convert.py       static pages -> Liquid snippets/sections, hard-coded prices -> live Shopify prices
    theme-src/       hand-written theme files (layout, templates, cart JS, settings, product-card …)
    check-words.mjs  banned-wording scan (`npm run check:shopify`)
    content_pack.py  optional admin import pack (product CSV, redirects) – not committed
```

## Day-to-day workflow

| Change | Where to edit | Then run |
|---|---|---|
| Copy, FAQ, product text, blog, layout of a page | `src/…`, `assets/css`, `assets/js` | `npm run build:shopify` |
| Theme-only behaviour (cart drawer, templates, locales, settings) | `shopify/tools/theme-src/…` | `npm run build:shopify` |
| Prices | **Shopify admin** (never in code) | – |

**Never edit** `shopify/assets|config|layout|locales|sections|snippets|templates` by hand — they are overwritten
by `npm run build:shopify`.

Prices always come from Shopify: `all_products['<handle>'].price | money` (subscribe price = 10% off, computed in
Liquid). The generator replaces every `$xx.xx` in the source with such an expression; no price is hard-coded in the
theme. (`npm run build` for Vercel still uses the sample prices in `src/data/products.mjs`.)

## Commands

All commands run from the repo root. The Shopify CLI is a dev dependency (`npm install`), used through `npx`.

```bash
npm install
npm run build:shopify          # rebuild shopify/ from the source (needs Node 18+ and Python 3)
npm run check:shopify          # banned wording scan on the theme (cure, treat, prevent, detox, cleanse, FDA approved)
npx shopify theme check --path shopify
```

### 1. Local preview

```bash
npx shopify theme dev --path shopify --store iqvsus-db.myshopify.com
```

Opens a hot-reloading preview (a temporary development theme, your live theme is not touched). Log in with the
store account when asked.

### 2. Upload a draft theme (never the live one)

```bash
npx shopify theme push --unpublished --path shopify --store iqvsus-db.myshopify.com --theme "Veda Apothecary draft"
```

`--unpublished` creates a **new unpublished theme**. Review it from *Online Store → Themes → … → Preview*, and only
publish it manually from the Shopify admin after checking.

> **Never** run `theme push --live`, `theme push --theme <id of the published theme>` or `theme publish`
> from this repo. Always push with `--unpublished`.

### 3. Zip for manual upload

```bash
npm run package:shopify        # = shopify theme package --path shopify
```

Creates `shopify/Veda Apothecary-1.0.0.zip` (git-ignored; contains only the standard theme folders, not `tools/`).
Upload it under *Online Store → Themes → Add theme → Upload zip file*.

## URLs the theme links to

`/collections/all`, `/collections/<energy|calm|digestion|immunity>`, `/products/<handle>`, `/pages/<handle>`,
`/blogs/journal`, `/blogs/journal/<article-handle>`, `/blogs/journal/tagged/<tag-handle>`,
`/policies/privacy-policy`, `/policies/terms-of-service`, `/policies/shipping-policy`, `/policies/refund-policy`,
`/cart`, `/checkout`. The Vercel site keeps its own URLs (`/shop/`, `/about/`, `/blog/…`).

## Handles the theme depends on (must exist in Shopify admin, spelled exactly)

**Products** (each has a designed page `snippets/pdp-<handle>.liquid`; any other product uses `pdp-generic`)

| Handle | Title |
|---|---|
| `moringa-powder` | Moringa Powder |
| `ashwagandha-powder` | Ashwagandha Powder |
| `triphala-powder` | Triphala Powder |
| `amla-powder` | Amla Powder |

**Collections** — `all` (built in), `energy`, `calm`, `digestion`, `immunity`
(`snippets/collection-<handle>.liquid`; unknown collections use the generic layout).

**Pages** — `about`, `faq`, `contact`, `wholesale`, `accessibility` (`snippets/page-<handle>.liquid`; page body may stay empty).
Policies (privacy, terms, shipping, refund) are the normal Shopify policies from *Settings → Policies*.

**Blog** — handle `journal` (title "Journal").

**Articles** (handle → blog tag):

| Article handle | Tag |
|---|---|
| `what-is-ayurveda` | Ayurveda Basics |
| `meet-moringa` | Botanicals |
| `ashwagandha-101` | Botanicals |
| `triphala-explained` | Botanicals |
| `meet-amla` | Botanicals |
| `golden-moon-milk` | Rituals and Recipes |
| `green-morning-smoothie` | Rituals and Recipes |
| `read-a-supplement-label` | Sourcing and Quality |
| `india-to-texas` | Sourcing and Quality |

**Blog tags** (handle = lower-case, "and" not "&") — the theme links to and renders these:
`Ayurveda Basics` → `/blogs/journal/tagged/ayurveda-basics`, `Botanicals` → `…/tagged/botanicals`,
`Rituals and Recipes` → `…/tagged/rituals-and-recipes`, `Sourcing and Quality` → `…/tagged/sourcing-and-quality`.
`main-blog.liquid` picks the designed tag page with `current_tags.first | handleize`, so the tags in the admin must
be written exactly as above.

**Other**
- Subscribe & Save uses selling plans (Shopify Subscriptions app). The option is hidden for a product with no selling plan.
- Contact and wholesale forms use Shopify's contact form; the newsletter box uses the customer form (tag `newsletter`).
- Discount code `VEDA10` is mentioned in the copy — create it in *Discounts*.

## Checks

- `npx shopify theme check --path shopify` — **0 errors**. The 73 remaining warnings are `HardcodedRoutes`
  (32 × `/`, 23 × `/collections/all`, 16 × `/collections/…` links kept as plain paths from the static source) and
  2 × `AssetPreload` in `layout/theme.liquid`. They are cosmetic; the URLs match the Shopify defaults. `shopify/.theme-check.yml` skips `tools/`.
- `npm run check:shopify` — banned-wording scan; the mandatory FDA disclaimer sentence is allowed.
- `npm run build` + `npm run check` — Vercel build and audit are unaffected.

## Optional: Vercel site checkout on Shopify

`src/site.mjs` → `shopify` (`storeDomain`, `checkout`, `variants`). Build with `VEDA_CHECKOUT=shopify npm run build`
(and fill `variants` with each product's Shopify variant id) to send the Vercel cart to
`https://iqvsus-db.myshopify.com/cart/<variantId>:<qty>,…`. Off by default.
