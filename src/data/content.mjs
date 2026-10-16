// Copy for benefit (collection) pages, the FAQ hub and shared snippets.
// All claims are "traditionally used to support…" style and rely on the * disclaimer shown on every page.

export const COLLECTIONS = [
  {
    slug: 'energy', goal: 'Energy', product: 'moringa', more: [],
    title: 'Ayurvedic Powders for Everyday Energy | Moringa — Veda Apothecary',
    desc: 'Explore pure Moringa leaf powder, traditionally used to support energy, nutrition and overall wellness. Single ingredient, small-batch milled in India.',
    h1: 'Ayurvedic powders for <span class="it" style="color:var(--saffron)">everyday energy.</span>',
    lead: 'A morning ritual that starts with one botanical: Moringa, the vivid green leaf powder traditionally used to support energy and nutrition.*',
    intro: [
      'In Ayurveda, energy is not something to chase with stimulants — it is built through food, rhythm and routine. Moringa leaves have been eaten across India for generations, and Moringa powder makes that tradition easy to bring into a modern kitchen.',
      'Veda Apothecary Moringa Powder is a single-ingredient leaf powder, milled in small batches so the color, aroma and character of the leaf stay intact. Stir it into a smoothie, juice or latte as part of a simple morning ritual.'
    ],
    steps: [
      ['Start small', 'Begin with half a teaspoon in a fruit smoothie while you get used to the fresh, grassy taste.'],
      ['Keep it consistent', 'A small, repeatable ritual — the same time each morning — is the heart of an Ayurvedic routine.'],
      ['Pair with fruit', 'Banana, pineapple, mango and citrus soften Moringa’s earthy notes.']
    ],
    faq: [
      ['Which Ayurvedic powder is traditionally used to support energy?', 'Moringa leaf powder is traditionally used to support energy, nutrition and overall wellness.* Veda Apothecary Moringa Powder contains only Moringa leaf.'],
      ['When should I take Moringa powder?', 'Many people enjoy it in the morning in a smoothie or juice. Follow the directions on the pouch.']
    ],
    articles: ['meet-moringa', 'green-morning-smoothie']
  },
  {
    slug: 'calm', goal: 'Calm', product: 'ashwagandha', more: [],
    title: 'Ayurvedic Powders for Calm & Balance | Ashwagandha — Veda Apothecary',
    desc: 'Discover pure Ashwagandha root powder, traditionally used to support stress management and everyday balance. Single ingredient, small-batch milled in India.',
    h1: 'Ayurvedic powders for <span class="it" style="color:var(--saffron)">calm &amp; balance.</span>',
    lead: 'An evening ritual with Ashwagandha, the earthy root traditionally used to support stress management and everyday resilience.*',
    intro: [
      'Ashwagandha is one of Ayurveda’s best-known botanicals. Its root has been taken for centuries as a <i>rasayana</i> — a herb traditionally used to support vitality — often stirred into warm milk at the end of the day.',
      'Veda Apothecary Ashwagandha Powder is made from the root alone, with no additives, fillers or preservatives. Whisk it into golden moon milk, warm water or a smoothie as an unhurried evening ritual.'
    ],
    steps: [
      ['Wind down', 'Warm milk, a pinch of cinnamon and a teaspoon of Ashwagandha make a cozy end to the day.'],
      ['Balance the taste', 'Honey, cardamom and nutmeg round out Ashwagandha’s earthy flavor.'],
      ['Check first', 'Ashwagandha may not be suitable during pregnancy or alongside some medications — consult a healthcare professional.']
    ],
    faq: [
      ['Which Ayurvedic powder is traditionally used to support stress management?', 'Ashwagandha root powder is traditionally used to support stress management, vitality and overall wellness.*'],
      ['How is Ashwagandha traditionally taken?', 'Traditionally with warm milk in the evening. Mix 1 teaspoon (3–5 g) as directed on the pouch.']
    ],
    articles: ['ashwagandha-101', 'golden-moon-milk']
  },
  {
    slug: 'digestion', goal: 'Digestion', product: 'triphala', more: [],
    title: 'Ayurvedic Powders for Digestion | Triphala — Veda Apothecary',
    desc: 'Explore pure Triphala powder — Amalaki, Haritaki and Bibhitaki — traditionally used to support digestive health and regularity. Small-batch milled in India.',
    h1: 'Ayurvedic powders for <span class="it" style="color:var(--saffron)">digestive balance.</span>',
    lead: 'A night ritual with Triphala, the classic three-fruit blend traditionally used to support digestive health and regularity.*',
    intro: [
      'Triphala — “three fruits” — is among the most trusted formulations in Ayurveda. It combines Amalaki, Haritaki and Bibhitaki in a single powder and is traditionally taken with warm water before bed.',
      'Veda Apothecary Triphala Powder is a pure three-fruit blend with nothing else added. Its tangy, slightly bitter, astringent taste is the natural flavor of the fruits.'
    ],
    steps: [
      ['Warm water, slowly', 'Stir 1 teaspoon into a cup of warm water, let it rest for a minute and sip.'],
      ['Soften the taste', 'Add a little honey once the water has cooled slightly.'],
      ['Ask if unsure', 'If you have a digestive condition or take medication, speak with a healthcare professional before use.']
    ],
    faq: [
      ['Which Ayurvedic powder is traditionally used to support digestion?', 'Triphala, a blend of Amalaki, Haritaki and Bibhitaki, is traditionally used to support digestive health and regularity.*'],
      ['When is Triphala traditionally taken?', 'Typically in the evening with warm water. Follow the directions on the pouch.']
    ],
    articles: ['triphala-explained', 'meet-amla']
  },
  {
    slug: 'immunity', goal: 'Immunity', product: 'amla', more: ['moringa'],
    title: 'Ayurvedic Powders for Immunity & Vitamin C | Amla — Veda Apothecary',
    desc: 'Discover pure Amla (Indian gooseberry) powder, a natural source of Vitamin C traditionally valued to support immunity. Small-batch milled in India.',
    h1: 'Ayurvedic powders for <span class="it" style="color:var(--saffron)">immunity &amp; Vitamin C.</span>',
    lead: 'A midday ritual with Amla, the Indian gooseberry — a natural source of Vitamin C and traditionally valued to support immunity.*',
    intro: [
      'Amla is one of the most treasured fruits in Ayurveda. Eaten fresh, pickled, dried and powdered across India, it is prized for its sharp, refreshing sourness and its natural Vitamin C.',
      'Veda Apothecary Amla Powder is a single-ingredient fruit powder. One 5 g serving lists 25 mg of Vitamin C (28% DV) on the Supplement Facts panel. Moringa, a natural source of vitamins and minerals, is a natural companion in an everyday routine.'
    ],
    steps: [
      ['Make it a tonic', 'Stir Amla into sparkling water with lime and mint for a bright midday drink.'],
      ['Blend it', 'Fruit smoothies take the edge off Amla’s tartness.'],
      ['Store it well', 'Keep the pouch sealed in a cool, dry place away from direct sunlight.']
    ],
    faq: [
      ['Which Ayurvedic powder is a natural source of Vitamin C?', 'Amla (Indian gooseberry) powder. Veda Apothecary Amla Powder lists 25 mg of Vitamin C per 5 g serving (28% DV).'],
      ['Is Amla the same as Triphala?', 'No. Amla is a single fruit; Triphala is a blend of three fruits that includes Amla.']
    ],
    articles: ['meet-amla', 'read-a-supplement-label']
  }
];

export const FAQ_GROUPS = [
  {
    title: 'About the products',
    items: [
      ['What are Veda Apothecary powders?', 'Veda Apothecary makes premium single-ingredient Ayurvedic powders — Moringa, Ashwagandha, Triphala and Amla. Each 8 oz (227 g) resealable pouch contains one botanical (Triphala is a three-fruit blend) with no additives, fillers or preservatives.'],
      ['How do I use the powders?', 'Mix 1 teaspoon (3–5 g) with water, juice, a smoothie or your favorite beverage. Triphala is traditionally taken with warm water. Always follow the directions on the pouch.'],
      ['Is there anything added to the powders?', 'No. Each pouch contains a single botanical — no additives, fillers or preservatives.'],
      ['Where are the powders made?', 'The botanicals are sourced and milled in India in a GMP-certified, ISO-certified facility, then distributed in the USA by Old Soul Goods Inc. from Katy, Texas.'],
      ['What is the difference between Amla and Triphala?', 'Amla is a single fruit (Indian gooseberry). Triphala is a three-fruit blend of Amla, Haritaki and Bibhitaki.'],
      ['How should I store the powders?', 'Store in a cool, dry place, keep the pouch tightly sealed after opening, and keep away from moisture and direct sunlight.']
    ]
  },
  {
    title: 'Safety & labeling',
    items: [
      ['Are these products safe during pregnancy?', 'Please consult a healthcare professional before use if you are pregnant, nursing or taking medication. Keep out of reach of children.'],
      ['Do the products treat or cure any condition?', 'No. These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. They are herbal supplements traditionally used to support wellness.'],
      ['How do I report a complaint or adverse event?', 'Call +1 (713) 770-6032 or email hello@vedaapothecaryusa.com.'],
      ['Why do the Supplement Facts list botanical names?', 'U.S. labeling asks supplements to identify each botanical and the plant part used — for example Moringa oleifera (leaf) or Withania somnifera (root).']
    ]
  },
  {
    title: 'Orders, shipping & returns',
    items: [
      ['How fast is shipping?', 'Standard shipping takes 3–6 business days and is free on orders over $50 (otherwise $5.95). Express shipping takes 1–3 business days ($12.95). Orders ship in 1–2 business days from Texas.'],
      ['Do you ship across the USA?', 'Yes. We ship to all 50 states from Katy, Texas.'],
      ['Can I subscribe and save?', 'Yes. Subscribe & Save 10% on any product, and skip, pause or cancel anytime.'],
      ['What is your return policy?', 'Unopened products can be returned within 30 days of delivery. See our Shipping & Returns page for details.'],
      ['Do you offer wholesale?', 'Yes. Our 8 oz (227 g) pouches are retail-ready with barcodes and Supplement Facts panels. Visit the Wholesale page to request pricing.']
    ]
  }
];

// Short Q&A used on the home page (also emitted as FAQPage schema there).
export const HOME_FAQ = [
  ['How do I use the powders?', 'Mix 1 teaspoon (3–5 g) with water, juice, a smoothie or your favorite beverage. Triphala is traditionally taken with warm water.'],
  ['Is there anything added?', 'No. Each pouch contains a single botanical — no additives, fillers or preservatives.'],
  ['Where are they made?', 'Sourced and milled in India in a GMP-certified, ISO-certified facility, then shipped from Texas across the USA.'],
  ['How fast is shipping?', 'Standard shipping takes 3–6 business days and is free over $50. Express takes 1–3 business days.'],
  ['Can I subscribe?', 'Yes — Subscribe & Save 10% on any product. Skip, pause or cancel anytime.']
];
