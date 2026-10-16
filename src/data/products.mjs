// Product catalogue. Wording follows the "Final U.S. Label Changes" brief:
//  - structure/function wording is "traditionally used to support…" and carries the * disclaimer
//  - never "chemical free", "FDA approved" or "FDA certified"
//  - Supplement Facts %DV use current U.S. Daily Values (quantities unchanged from the label)
// Prices are the prototype's SAMPLE prices — confirm before launch (they feed the Product schema).

export const ORDER = ['moringa', 'ashwagandha', 'triphala', 'amla'];

export const PRODUCTS = {
  moringa: {
    id: 'moringa',
    slug: 'moringa-powder',
    name: 'Moringa Powder',
    short: 'Moringa',
    ident: 'Natural Moringa Powder',
    latin: 'Moringa oleifera',
    part: 'Leaf',
    benefit: 'energy',
    goal: 'Energy',
    tags: 'Energy · Immunity · Nutrition',
    price: 16.99,
    sku: 'VA-MOR-8OZ',
    c: '#3B4A12', tint: '#ECEFDD', viv: '#4E7A1E',
    summary: 'Traditionally used to support energy, nutrition, immunity and overall wellness.*',
    long: "Milled from carefully selected Moringa oleifera leaves, this vibrant green powder is one of nature's most nutrient-dense botanicals — a natural source of vitamins, minerals, antioxidants, and plant-based nutrients.*",
    pts: [
      'Traditionally used to support energy and vitality*',
      'A natural source of vitamins, minerals & antioxidants',
      'Effortless daily ritual — stir into water, juice, or a smoothie'
    ],
    use: 'Mix 1 teaspoon (3–5 g) with water, juice, a smoothie or your favorite beverage.',
    ingredients: 'Moringa (Drumstick Tree) leaf powder — <i>Moringa oleifera</i> (leaf).',
    servings: 'about 38',
    sf: {
      size: '2 rounded tsp (6 g)', cal: 10,
      rows: [['Total Carbohydrate', '2 g', '<1%*'], ['Dietary Fiber', '1 g', '4%*', 1], ['Protein', '2 g', ''], ['Calcium', '120 mg', '9%'], ['Iron', '1.7 mg', '9%'], ['Potassium', '80 mg', '2%']],
      ing: [['Moringa (Drumstick Tree) leaf powder', '<i>Moringa oleifera</i> (leaf)', '6 g']]
    },
    seo: {
      title: 'Moringa Powder — Pure Moringa Leaf Powder, 8 oz | Veda Apothecary',
      desc: 'Pure single-ingredient Moringa leaf powder (Moringa oleifera), small-batch milled in India. 8 oz pouch, no additives or fillers. Ships across the USA from Texas.',
      h1: 'Moringa Powder'
    },
    about: [
      'Moringa powder is made by gently drying and milling the leaves of <i>Moringa oleifera</i>, a fast-growing tree native to the foothills of the Himalayas in northern India. In Indian kitchens the leaves, often called drumstick leaves, are cooked as a vegetable; milling them into a fine powder makes them easy to use every day.',
      'Veda Apothecary Moringa Powder has exactly one ingredient — Moringa leaf — with no additives, fillers or preservatives. It is milled in small batches to protect its vivid green color and fresh, grassy aroma. A 6 g serving provides 120 mg of calcium (9% DV) and 1.7 mg of iron (9% DV), alongside 1 g of dietary fiber, as listed on the Supplement Facts panel.'
    ],
    ways: [
      ['Green smoothie', 'Blend 1 teaspoon with banana, spinach, pineapple and oat milk.'],
      ['Fresh juice', 'Stir into orange or apple juice — fruit softens Moringa’s earthy taste.'],
      ['Green latte', 'Whisk into warm oat milk with a little honey or maple syrup.'],
      ['Yogurt & oat bowls', 'Fold a half teaspoon into yogurt, overnight oats or chia pudding.']
    ],
    faq: [
      ['What is Moringa powder?', 'Moringa powder is a dried, finely milled powder made from the leaves of the Moringa oleifera tree. Veda Apothecary Moringa Powder contains only Moringa leaf — nothing else.'],
      ['How do I use Moringa powder?', 'Mix 1 teaspoon (3–5 g) with water, juice, a smoothie or your favorite beverage, as directed on the pouch. If you are new to the taste, start with half a teaspoon.'],
      ['What does Moringa powder taste like?', 'It tastes fresh, grassy and slightly earthy. Most people prefer it blended with fruit, such as banana, pineapple or mango.'],
      ['When is the best time to take Moringa?', 'Many people enjoy Moringa in the morning, stirred into a smoothie or juice. There is no wrong time of day — follow the directions on the pouch.'],
      ['Is Moringa powder safe during pregnancy?', 'Please consult a healthcare professional before use if you are pregnant, nursing or taking medication. Keep out of reach of children.']
    ],
    articles: ['meet-moringa', 'green-morning-smoothie', 'what-is-ayurveda']
  },

  ashwagandha: {
    id: 'ashwagandha',
    slug: 'ashwagandha-powder',
    name: 'Ashwagandha Powder',
    short: 'Ashwagandha',
    ident: 'Natural Ashwagandha Powder',
    latin: 'Withania somnifera',
    part: 'Root',
    benefit: 'calm',
    goal: 'Calm',
    tags: 'Strength · Vitality · Calm',
    price: 15.99,
    sku: 'VA-ASH-8OZ',
    c: '#9A4F0C', tint: '#F6E7D2', viv: '#C0661F',
    summary: 'Traditionally used to support stress management, vitality, strength and overall wellness.*',
    long: "Drawn from premium Ashwagandha root, one of nature's most revered adaptogens, traditionally valued for supporting resilience, stamina, and a sense of everyday balance.*",
    pts: [
      'Traditionally used to support stress management*',
      'Valued for vitality, strength & overall well-being*',
      'A grounding addition to any wellness ritual'
    ],
    use: 'Mix 1 teaspoon (3–5 g) with warm milk, water, juice or a smoothie.',
    ingredients: 'Ashwagandha (Indian Ginseng / Winter Cherry) root powder — <i>Withania somnifera</i> (root).',
    servings: 'about 38',
    sf: {
      size: '2 rounded tsp (6 g)', cal: 15,
      rows: [['Total Carbohydrate', '3 g', '1%*'], ['Dietary Fiber', '2 g', '7%*', 1], ['Calcium', '1 mg', '<1%'], ['Iron', '0.2 mg', '1%']],
      ing: [['Ashwagandha (Indian Ginseng / Winter Cherry) root powder', '<i>Withania somnifera</i> (root)', '6 g']]
    },
    seo: {
      title: 'Ashwagandha Powder — Pure Ashwagandha Root Powder, 8 oz | Veda Apothecary',
      desc: 'Pure single-ingredient Ashwagandha root powder (Withania somnifera), small-batch milled in India. 8 oz pouch, no additives or fillers. Ships across the USA.',
      h1: 'Ashwagandha Powder'
    },
    about: [
      'Ashwagandha (<i>Withania somnifera</i>), also called Indian ginseng or winter cherry, is a small evergreen shrub grown in India. Its root has been part of traditional Ayurvedic practice for centuries, where it is classed as a <i>rasayana</i> — a group of herbs traditionally taken to support overall vitality.',
      'Our Ashwagandha Powder is made from the root only, milled into a fine, earthy powder with nothing added. It is traditionally stirred into warm milk in the evening as a wind-down ritual. A 6 g serving contains 15 calories and 2 g of dietary fiber, as shown on the Supplement Facts panel.'
    ],
    ways: [
      ['Golden moon milk', 'Whisk 1 teaspoon into warm milk with cinnamon, cardamom and a little honey.'],
      ['Warm water or tea', 'Stir into a cup of warm water or a mild herbal tea in the evening.'],
      ['Smoothies', 'Blend with banana, dates and almond milk — sweet fruit balances the earthy taste.'],
      ['Oatmeal', 'Stir a half teaspoon into warm oatmeal with nuts and fruit.']
    ],
    faq: [
      ['What is Ashwagandha powder?', 'Ashwagandha powder is the dried, finely milled root of Withania somnifera, a shrub used in Ayurveda for centuries. Veda Apothecary Ashwagandha Powder contains only Ashwagandha root.'],
      ['How do I take Ashwagandha powder?', 'Mix 1 teaspoon (3–5 g) with warm milk, water, juice or a smoothie, as directed on the pouch. Traditionally it is taken in warm milk in the evening.'],
      ['What does Ashwagandha taste like?', 'It has an earthy, slightly bitter taste. Warm milk, cinnamon and a little honey round it out well.'],
      ['Who should avoid Ashwagandha?', 'The U.S. National Center for Complementary and Integrative Health (NCCIH) advises that ashwagandha may be unsafe during pregnancy, and that people with certain conditions or taking medication should speak with a healthcare provider first. Consult a healthcare professional before use.'],
      ['What is in Veda Apothecary Ashwagandha Powder?', 'One ingredient: Ashwagandha (Withania somnifera) root. There are no additives, fillers or preservatives. Each 8 oz (227 g) pouch lists about 38 servings.']
    ],
    articles: ['ashwagandha-101', 'golden-moon-milk', 'what-is-ayurveda']
  },

  triphala: {
    id: 'triphala',
    slug: 'triphala-powder',
    name: 'Triphala Powder',
    short: 'Triphala',
    ident: 'Natural Triphala Powder (Three-Fruit Blend)',
    latin: 'Three-Fruit Blend',
    part: 'Three fruits',
    benefit: 'digestion',
    goal: 'Digestion',
    tags: 'Digestion · Balance · Detox',
    price: 14.99,
    sku: 'VA-TRI-8OZ',
    c: '#6B3A1A', tint: '#F1E2D3', viv: '#8A4422',
    summary: 'Traditionally used to support digestive health, gentle detoxification, and regularity.*',
    long: "A revered three-fruit herbal blend, gently combined to support the body's own rhythm — one of the most trusted formulations in traditional herbal wellness.*",
    pts: [
      'Traditionally used to support digestive health*',
      'Supports gentle, natural detoxification*',
      'A time-tested ritual for everyday regularity*'
    ],
    use: 'Mix 1 teaspoon (3–5 g) with warm water and consume as directed by your healthcare professional.',
    ingredients: 'Triphala three-fruit blend: Amla (Indian Gooseberry, <i>Phyllanthus emblica</i>, fruit), Haritaki (Chebulic Myrobalan, <i>Terminalia chebula</i>, fruit), Bibhitaki (Belleric Myrobalan, <i>Terminalia bellirica</i>, fruit).',
    servings: 'about 38',
    sf: {
      size: '2 rounded tsp (6 g)', cal: 20,
      rows: [['Total Carbohydrate', '5 g', '2%*'], ['Dietary Fiber', '1 g', '4%*', 1], ['Total Sugars', '1 g', '', 1], ['Calcium', '15 mg', '1%'], ['Iron', '0.3 mg', '2%'], ['Potassium', '50 mg', '1%']],
      ing: [['Triphala Three-Fruit Blend', '', '6 g'], ['Amla (Indian Gooseberry)', '<i>Phyllanthus emblica</i> (fruit)', '', 1], ['Haritaki (Chebulic Myrobalan)', '<i>Terminalia chebula</i> (fruit)', '', 1], ['Bibhitaki (Belleric Myrobalan)', '<i>Terminalia bellirica</i> (fruit)', '', 1]]
    },
    seo: {
      title: 'Triphala Powder — Pure Three-Fruit Blend, 8 oz | Veda Apothecary',
      desc: 'Traditional Ayurvedic Triphala powder — Amalaki, Haritaki and Bibhitaki in one pure three-fruit blend. 8 oz pouch, no additives. Shipped across the USA.',
      h1: 'Triphala Powder'
    },
    about: [
      'Triphala means “three fruits” in Sanskrit. It is a traditional Ayurvedic blend of Amalaki (<i>Phyllanthus emblica</i>, Indian gooseberry), Haritaki (<i>Terminalia chebula</i>) and Bibhitaki (<i>Terminalia bellirica</i>), dried and milled together. It is one of the most widely used formulations in Ayurveda and is traditionally taken with warm water in the evening.',
      'Veda Apothecary Triphala Powder is a pure three-fruit blend: only the three fruits, with no additives, fillers or preservatives. Its taste is tangy, slightly bitter and astringent — that is simply the natural flavor of the fruits, and nothing is added to mask it. Each fruit is listed individually on the Supplement Facts panel, as U.S. labeling requires for a blend.'
    ],
    ways: [
      ['Warm-water ritual', 'Stir 1 teaspoon into a cup of warm water, let it rest for a minute and sip slowly.'],
      ['A touch of honey', 'Once the water has cooled slightly, a little honey softens the astringent taste.'],
      ['Evening routine', 'Traditionally taken before bed as part of an unhurried wind-down.'],
      ['Start small', 'New to Triphala? Begin with half a teaspoon and build up as directed.']
    ],
    faq: [
      ['What is Triphala powder?', 'Triphala is a traditional Ayurvedic blend of three dried fruits — Amalaki (Amla), Haritaki and Bibhitaki. Veda Apothecary Triphala Powder is a pure three-fruit blend with nothing else added.'],
      ['How do I take Triphala powder?', 'Mix 1 teaspoon (3–5 g) with warm water, as directed on the pouch and by your healthcare professional. Traditionally it is taken in the evening.'],
      ['Why does Triphala taste so strong?', 'Triphala combines tangy, bitter and astringent fruits. That is its natural taste; nothing is added to mask it.'],
      ['Is Triphala the same as Amla?', 'No. Amla (Amalaki) is one of the three fruits in Triphala. Amla Powder on its own is a single-fruit powder with a sour, tangy taste.'],
      ['Who should check with a professional first?', 'Consult a healthcare professional before use if you are pregnant, nursing or taking medication. If you have a digestive condition, speak with your healthcare provider.']
    ],
    articles: ['triphala-explained', 'meet-amla', 'what-is-ayurveda']
  },

  amla: {
    id: 'amla',
    slug: 'amla-powder',
    name: 'Amla Powder',
    short: 'Amla',
    ident: 'Natural Amla Powder',
    latin: 'Phyllanthus emblica',
    part: 'Fruit',
    benefit: 'immunity',
    goal: 'Immunity',
    tags: 'Immunity · Vitamin C · Glow',
    price: 14.99,
    sku: 'VA-AML-8OZ',
    c: '#3F4F57', tint: '#E5EAEB', viv: '#2F7383',
    summary: 'Traditionally used to support immunity, digestion, and radiant skin & hair.*',
    long: 'Known as Indian Gooseberry, Amla is one of the most valued botanicals in Ayurveda. Rich in natural Vitamin C and antioxidants, it is traditionally used to support immunity, digestion, and healthy hair and skin.*',
    pts: [
      'A natural source of Vitamin C',
      'Traditionally valued to support immunity*',
      'A tangy, potent addition to teas or tonics'
    ],
    use: 'Mix 1 teaspoon (3–5 g) with water, juice, a smoothie or your favorite beverage.',
    ingredients: 'Amla (Indian Gooseberry) fruit powder — <i>Phyllanthus emblica</i> (fruit).',
    servings: 'about 45',
    sf: {
      size: '2 rounded tsp (5 g)', cal: 15,
      rows: [['Total Carbohydrate', '4 g', '1%*'], ['Dietary Fiber', '1 g', '4%*', 1], ['Total Sugars', '2 g', '', 1], ['Protein', '1 g', ''], ['Vitamin C', '25 mg', '28%'], ['Calcium', '10 mg', '<1%'], ['Iron', '0.2 mg', '1%']],
      ing: [['Amla (Indian Gooseberry) fruit powder', '<i>Phyllanthus emblica</i> (fruit)', '5 g']]
    },
    seo: {
      title: 'Amla Powder — Pure Indian Gooseberry Powder, 8 oz | Veda Apothecary',
      desc: 'Pure single-ingredient Amla (Indian gooseberry) fruit powder, a natural source of Vitamin C. Small-batch milled in India, 8 oz pouch, no additives. Ships across the USA.',
      h1: 'Amla Powder'
    },
    about: [
      'Amla (<i>Phyllanthus emblica</i>), also called Indian gooseberry or Amalaki, is a round, pale-green fruit with a bright, sour taste. It has been eaten fresh, pickled, dried and powdered across India for generations and holds a central place in Ayurveda.',
      'Veda Apothecary Amla Powder contains one ingredient — Amla fruit — with no additives, fillers or preservatives. It is a natural source of Vitamin C: a 5 g serving lists 25 mg, which is 28% of the Daily Value, on the Supplement Facts panel. Because Amla is so sour, most people mix it into juice, sparkling water or smoothies rather than plain water.'
    ],
    ways: [
      ['Sparkling Amla tonic', 'Stir 1 teaspoon into sparkling water with lime and mint.'],
      ['Citrus juice', 'Mix into orange or pineapple juice; fruit balances the tartness.'],
      ['Smoothies', 'Blend with berries, mango or banana for a bright, tangy boost.'],
      ['Warm lemon water', 'Stir into warm water with a squeeze of lemon and a little honey.']
    ],
    faq: [
      ['What is Amla powder?', 'Amla powder is the dried, finely milled fruit of Phyllanthus emblica, known as Indian gooseberry. Veda Apothecary Amla Powder contains only Amla fruit.'],
      ['How much Vitamin C is in Amla powder?', 'One serving (2 rounded teaspoons, 5 g) lists 25 mg of Vitamin C, which is 28% of the Daily Value, on the Supplement Facts panel.'],
      ['How do I make Amla taste better?', 'Try it in sparkling water with lime and mint, or blended into a fruit smoothie. The sourness pairs well with sweet fruit and a little honey.'],
      ['What is the difference between Amla and Triphala?', 'Amla is a single fruit. Triphala is a blend of three fruits — Amla, Haritaki and Bibhitaki. Both are available from Veda Apothecary as pure powders.'],
      ['How should I store Amla powder?', 'Store in a cool, dry place, keep the pouch tightly sealed after opening, and keep away from moisture and direct sunlight.']
    ],
    articles: ['meet-amla', 'triphala-explained', 'read-a-supplement-label']
  }
};

export const SET = {
  id: 'ritual-set',
  slug: 'ritual-set',
  name: 'The Ritual Set',
  short: 'Ritual Set',
  ident: 'The Ritual Set — 4 herbal supplements',
  latin: 'All four botanicals, 4 × 8 oz',
  benefit: 'bundle',
  goal: 'Bundle',
  tags: 'Bundle · Save 13%',
  price: 54.99,
  sku: 'VA-SET-4X8OZ',
  c: '#B31D48', tint: '#F6E3DF', viv: '#B31D48',
  bundle: true,
  summary: 'The complete Veda Apothecary collection — Moringa, Ashwagandha, Triphala and Amla — for a full daily ritual of energy, calm, digestion and immunity.*',
  long: 'Four time-honored botanicals, milled into pure, single-ingredient powders. One set covers the whole day: Moringa in your morning smoothie, Amla in a midday tonic, Ashwagandha in evening moon milk and Triphala with warm water before bed.*',
  pts: [
    'Moringa, Ashwagandha, Triphala & Amla — 8 oz each',
    'Save vs. buying individually',
    'Makes a thoughtful wellness gift'
  ],
  use: 'Use each powder as directed on its pouch — typically 1 teaspoon (3–5 g) in water, juice, milk or a smoothie.',
  ingredients: 'Four pouches: 100% Moringa leaf powder, 100% Ashwagandha root powder, 100% Triphala three-fruit blend (Amla, Haritaki and Bibhitaki), 100% Amla fruit powder. Nothing else — no additives, fillers or preservatives.',
  seo: {
    title: 'The Ritual Set — Ayurvedic Powder Bundle (4 × 8 oz) | Veda Apothecary',
    desc: 'All four Veda Apothecary single-ingredient Ayurvedic powders in one box: Moringa, Ashwagandha, Triphala and Amla, 8 oz each. Save 13% versus buying separately.',
    h1: 'The Ritual Set'
  },
  about: [
    'The Ritual Set brings together all four Veda Apothecary botanicals — Moringa, Ashwagandha, Triphala and Amla — in four 8 oz resealable pouches. Each powder is a single ingredient with no additives, fillers or preservatives, so you always know exactly what you are adding to your day.',
    'The set follows the rhythm of a day: Moringa in the morning, Amla at midday, Ashwagandha in the evening and Triphala before bed. It is also a thoughtful wellness gift for anyone curious about everyday Ayurveda.'
  ],
  ways: [
    ['7 am — Moringa', 'Stir into a green smoothie or fresh juice.'],
    ['1 pm — Amla', 'Mix into sparkling water with lime and mint.'],
    ['7 pm — Ashwagandha', 'Whisk into warm golden moon milk.'],
    ['10 pm — Triphala', 'Stir into a cup of warm water before bed.']
  ],
  faq: [
    ['What is in the Ritual Set?', 'Four 8 oz (227 g) pouches: Moringa Powder, Ashwagandha Powder, Triphala Powder and Amla Powder — one pouch of each.'],
    ['How much do I save with the set?', 'The Ritual Set is priced 13% below buying the four powders individually.'],
    ['Can I use all four powders every day?', 'Each pouch lists its own directions. Consult a healthcare professional before use, especially if you are pregnant, nursing or taking medication.'],
    ['Is the set a good gift?', 'Yes — it is a complete introduction to everyday Ayurveda, with four pure powders and a simple morning-to-night routine.']
  ],
  articles: ['what-is-ayurveda', 'india-to-texas', 'read-a-supplement-label']
};

export const ALL = { ...PRODUCTS, 'ritual-set': SET };
export const LISTING = [...ORDER.map((k) => PRODUCTS[k]), SET];
export const SINGLE_SUM = +ORDER.reduce((s, k) => s + PRODUCTS[k].price, 0).toFixed(2);
SET.compare = SINGLE_SUM;

export const url = (p) => `/products/${p.slug}/`;
export const bySlug = (slug) => Object.values(ALL).find((p) => p.slug === slug);
