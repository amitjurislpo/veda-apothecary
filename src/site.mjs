// Global site configuration. Everything that is likely to change before launch lives here.
export const SITE = {
  name: 'Veda Apothecary',
  domain: 'https://vedaapothecaryusa.com',
  tagline: 'Pure single-ingredient Ayurvedic powders',
  description:
    'Premium single-ingredient Ayurvedic powders — Moringa, Ashwagandha, Triphala and Amla. Crafted in India, shipped across the USA from Katy, Texas.',
  locale: 'en_US',
  themeColor: '#0B4F45',
  // Distributor details are printed on the pouch and must match the label.
  company: {
    legalName: 'Old Soul Goods Inc.',
    street: '1325 Main Street Unit No. 1404',
    city: 'Katy',
    region: 'TX',
    postal: '77494',
    country: 'US',
    phone: '+1 (713) 770-6032',
    phoneHref: '+17137706032',
    email: 'hello@vedaapothecaryusa.com',
    wholesaleEmail: 'wholesale@vedaapothecaryusa.com',
    hours: 'Mon–Fri, 9am–6pm CT'
  },
  // Cart hand-off. Leave empty to send cart contents to the order e-mail address instead.
  // Set to a Shopify / Stripe Payment Link / hosted-checkout URL when the store back end is chosen.
  checkoutUrl: '',
  orderEmail: 'hello@vedaapothecaryusa.com',
  // Newsletter / contact / wholesale forms post here when set (e.g. a Formspree or Basin endpoint).
  formEndpoint: '',
  freeShippingOver: 50,
  subscribeDiscount: 0.1,
  social: [], // add profile URLs here; they are emitted as Organization.sameAs
  ga4: '', // e.g. 'G-XXXXXXXXXX' — analytics loads only when set
  today: '2026-10-16'
};

export const DISCLAIMER =
  'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';
export const IMG_NOTE = 'Image for illustration purposes only. Natural color and appearance may vary.';
export const PREG_NOTE =
  'Consult a healthcare professional before use, especially if you are pregnant, nursing, or taking medication.';
