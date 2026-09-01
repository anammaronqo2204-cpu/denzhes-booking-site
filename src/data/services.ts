export interface ServiceVariant {
  label: string;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  category: 'nails' | 'braids' | 'tribal' | 'cornrows' | 'combos' | 'installation' | 'lashes' | 'pondo';
  image: string;
  emoji: string;
  variants?: ServiceVariant[];
  price?: number;
  duration: string;
  description: string;
  active?: boolean;
  team?: 'denzhe' | 'braiders';
}

// Client-provided imagery
const NAIL_PLAIN = 'https://www.bing.com/th/id/OIP.ALL71sb3i4a5a9ILDurHdAHaLH?w=400&h=520&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2';
const NAIL_FRENCH = 'https://www.bing.com/th/id/OIP.VbwyBKqVdSy-AVevreKyOgHaJQ?w=400&h=500&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2';
const NAIL_DESIGN = 'https://www.bing.com/th/id/OIP.DpBmaGLCQEBAlRhnYL7BhgHaHa?w=420&h=420&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2';
const PEDICURE_IMG = 'https://th.bing.com/th/id/OIP.1fo4TnNG4BA012kVdUy11wHaJP?w=420&h=485&c=6&r=0&o=7&pid=1.7&rm=3';
const HANDS_GEL_IMG = 'https://tse1.explicit.bing.net/th/id/OIP.fGKlCfwk5P6y-BWxDVGyoQHaJ4?w=420&h=560&c=7&r=0&o=7&pid=1.7&rm=3';
const BOX_KNOTLESS = 'https://th.bing.com/th/id/OIP.uhTgmaL62rDhAwgpjIOwrwHaJQ?w=420&h=525&c=7&r=0&o=7&pid=1.7&rm=3';
const STANDARD_KNOTLESS = 'https://th.bing.com/th/id/OIP.rMlK6oU3jjtB_YJIr8vztwHaNK?w=400&h=712&c=7&r=0&o=7&pid=1.7&rm=3';
const GODDESS_KNOTLESS = 'https://th.bing.com/th/id/OIP.b-k3R2jtieENK-TMwbVQTwHaNK?w=400&h=712&c=7&r=0&o=7&pid=1.7&rm=3';
const SMALL_KNOTLESS = 'https://th.bing.com/th/id/OIP.RzKiO_4K6x-RoP73NFhogAHaJQ?w=420&h=525&c=7&r=0&o=7&pid=1.7&rm=3';
const MILANO_CURLS = 'https://tse1.mm.bing.net/th/id/OIP.C4Io29m5LJjfokd5q1CavAHaHa?w=420&h=420&c=7&r=0&o=7&pid=1.7&rm=3';

export const services: Service[] = [
  // === NAILS (one bubble per style, length dropdown swaps the price) ===
  {
    id: 'plain-nails',
    name: 'Plain Nails',
    category: 'nails',
    image: NAIL_PLAIN,
    emoji: '💅',
    variants: [
      { label: 'Short', price: 180 },
      { label: 'Medium', price: 200 },
      { label: 'Long', price: 220 },
    ],
    duration: '~2 hrs',
    description: 'Clean, classic nail set in your choice of length.',
  },
  {
    id: 'french-nails',
    name: 'French Nails',
    category: 'nails',
    image: NAIL_FRENCH,
    emoji: '🤍',
    variants: [
      { label: 'Short', price: 200 },
      { label: 'Medium', price: 220 },
      { label: 'Long', price: 240 },
    ],
    duration: '~2 hrs',
    description: 'Elegant French tips with a timeless finish.',
  },
  {
    id: 'design-nails',
    name: 'Design Nails',
    category: 'nails',
    image: NAIL_DESIGN,
    emoji: '✨',
    variants: [
      { label: 'Short', price: 220 },
      { label: 'Medium', price: 240 },
      { label: 'Long', price: 260 },
    ],
    duration: '~2.5 hrs',
    description: 'Custom nail art and creative designs to match your vibe.',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    category: 'nails',
    image: PEDICURE_IMG,
    emoji: '🦶',
    price: 180,
    duration: '~1 hr',
    description: 'Pamper your feet with a relaxing pedicure treatment.',
  },
  {
    id: 'hands-gel',
    name: 'Hands Gel',
    category: 'nails',
    image: HANDS_GEL_IMG,
    emoji: '🫧',
    price: 120,
    duration: '~45 min',
    description: 'Glossy gel overlay for your natural nails.',
  },
  {
    id: 'toes-gel',
    name: 'Toes Gel',
    category: 'nails',
    image: 'https://i.pinimg.com/originals/32/f1/99/32f1994a55607edc0276ff2a83a00ffa.jpg',
    emoji: '🫧',
    price: 120,
    duration: '~45 min',
    description: 'Gel polish for perfectly polished toes.',
  },

  // === BRAIDS (hairpiece included) ===
  {
    id: 'normal-braids',
    name: 'Normal Braids',
    category: 'braids',
    image: 'https://i.pinimg.com/originals/a8/f1/19/a8f1195df039827af94a9efbc4b84f73.jpg',
    emoji: '🪢',
    price: 250,
    duration: '~3-4 hrs',
    description: 'Classic neat braids for everyday protective wear. Hairpiece included.',
  },
  {
    id: 'short-knotless-braid',
    name: 'Short Knotless Braid',
    category: 'braids',
    image: 'https://sistersbombshell.com/wp-content/uploads/2023/05/Short-Knotless-Braids-with-Ringlets.jpg',
    emoji: '🪢',
    price: 350,
    duration: '~3-4 hrs',
    description: 'Shoulder-length knotless braids, light on the edges. Hairpiece included.',
  },
  {
    id: 'box-knotless-braids',
    name: 'Box Knotless Braids',
    category: 'braids',
    image: BOX_KNOTLESS,
    emoji: '🪢',
    price: 400,
    duration: '~4-5 hrs',
    description: 'Box-parted knotless braids with a full, neat finish. Hairpiece included.',
  },
  {
    id: 'standard-knotless-braids',
    name: 'Standard Knotless Braids',
    category: 'braids',
    image: STANDARD_KNOTLESS,
    emoji: '🪢',
    price: 450,
    duration: '~4-5 hrs',
    description: 'Our signature standard knotless set, tension-free and sleek. Hairpiece included.',
  },
  {
    id: 'goddess-knotless-braids',
    name: 'Goddess Knotless Braids',
    category: 'braids',
    image: GODDESS_KNOTLESS,
    emoji: '🪢',
    price: 600,
    duration: '~5-6 hrs',
    description: 'Knotless braids with soft goddess curls woven through. Hairpiece included.',
  },
  {
    id: 'small-knotless-braids',
    name: 'Small Knotless Braids',
    category: 'braids',
    image: SMALL_KNOTLESS,
    emoji: '🪢',
    price: 650,
    duration: '~5-6 hrs',
    description: 'Finer, smaller knotless braids for a fuller look. Hairpiece included.',
  },
  {
    id: 'milano-curls',
    name: 'Milano Curls',
    category: 'braids',
    image: MILANO_CURLS,
    emoji: '🌀',
    price: 500,
    duration: '~4-5 hrs',
    description: 'Bouncy Milano curl style with a soft, glamorous finish. Hairpiece included.',
  },
  {
    id: 'knotless-french-curls',
    name: 'Knotless French Curls',
    category: 'braids',
    image: 'https://i.pinimg.com/videos/thumbnails/originals/9b/12/bb/9b12bbbcc5a9791be37242bd43a2bf32.0000000.jpg',
    emoji: '🌀',
    price: 650,
    duration: '~5-6 hrs',
    description: 'Knotless braids finished with French curl tips. Hairpiece included.',
  },

  // === TRIBAL BRAIDS (hairpiece included) ===
  {
    id: 'tribal-braids',
    name: 'Tribal Braids',
    category: 'tribal',
    image: 'https://lovehairstyles.com/wp-content/uploads/2023/04/tribal-braids-natural-hair-fulani.jpg',
    emoji: '👑',
    price: 400,
    duration: '~4-5 hrs',
    description: 'Patterned tribal braids with a striking centre part. Hairpiece included.',
  },
  {
    id: 'tribal-knotless-ponytail',
    name: 'Tribal with Knotless Ponytail',
    category: 'tribal',
    image: 'https://newnaturalhairstyles.com/wp-content/uploads/2025/10/Bun-with-Hanging-Tribal-Knotless-Braids.jpg',
    emoji: '👑',
    price: 650,
    duration: '~5-6 hrs',
    description: 'Tribal pattern flowing into a knotless ponytail. Hairpiece included.',
  },
  {
    id: 'tribal-goddess-braids',
    name: 'Tribal Goddess Braids',
    category: 'tribal',
    image: GODDESS_KNOTLESS,
    emoji: '👑',
    price: 550,
    duration: '~4-5 hrs',
    description: 'Tribal braids softened with goddess curls. Hairpiece included.',
  },
  {
    id: 'tribal-goda',
    name: 'Tribal Goda',
    category: 'tribal',
    image: 'https://braidhairstyles.com/wp-content/uploads/2022/09/Goddess-Tribal-Braids.jpeg',
    emoji: '👑',
    price: 400,
    duration: '~3-4 hrs',
    description: 'Tribal goda styling with neat rows and shape. Hairpiece included.',
  },
  {
    id: 'tribal-curls',
    name: 'Tribal Curls',
    category: 'tribal',
    image: 'https://media.lovelyish.com/wp-content/uploads/2026/04/Tribal-Braids-With-Curly-Ends.jpg',
    emoji: '👑',
    price: 400,
    duration: '~3-4 hrs',
    description: 'Tribal braiding with curled ends for movement. Hairpiece included.',
  },

  // === CORNROWS (hairpiece included) ===
  {
    id: 'straight-back',
    name: 'Straight Back',
    category: 'cornrows',
    image: 'https://braidhairstyles.com/wp-content/uploads/2022/08/Straight-Back-Braids-scaled.jpeg',
    emoji: '➖',
    price: 300,
    duration: '~2-3 hrs',
    description: 'Sleek straight-back cornrows, simple and clean. Hairpiece included.',
  },
  {
    id: 'straight-up',
    name: 'Straight Up',
    category: 'cornrows',
    image: 'https://i.pinimg.com/originals/83/0b/b5/830bb52f7a81a23c77aafb65bf9e6f0e.jpg',
    emoji: '⬆️',
    price: 350,
    duration: '~2-3 hrs',
    description: 'Cornrows styled upwards towards the crown. Hairpiece included.',
  },
  {
    id: 'styled-cornrows',
    name: 'Styled Cornrows',
    category: 'cornrows',
    image: 'https://www.iconichairstyles.com/images/cornrows-hairstyles/9.webp',
    emoji: '✨',
    price: 300,
    duration: '~2-3 hrs',
    description: 'Designed cornrow patterns tailored to your face. Hairpiece included.',
  },
  {
    id: 'straight-side',
    name: 'Straight Side',
    category: 'cornrows',
    image: 'https://i.pinimg.com/originals/41/ea/75/41ea759b98df83e1144e557d9fb394a2.jpg',
    emoji: '➡️',
    price: 350,
    duration: '~2-3 hrs',
    description: 'Side-swept straight cornrows for a softer line. Hairpiece included.',
  },
  {
    id: 'freehand-snoopy',
    name: 'Freehand / Snoopy',
    category: 'cornrows',
    image: 'https://i.pinimg.com/originals/b6/89/56/b68956bb283f972b65d5b001439e38d1.jpg',
    emoji: '🎋',
    price: 150,
    duration: '~1-2 hrs',
    description: 'Freehand snoopy cornrows, quick and comfy. Hairpiece included.',
  },
  {
    id: 'styled-two-line-curls',
    name: 'Styled Two Line with Curls',
    category: 'cornrows',
    image: 'https://hairstylecamp.com/wp-content/uploads/two-cornrows-with-curly-ends.jpg.webp',
    emoji: '🌀',
    price: 300,
    duration: '~2-3 hrs',
    description: 'Two-line cornrow styling finished with curls. Hairpiece included.',
  },
  {
    id: 'wash-and-dry',
    name: 'Wash & Dry',
    category: 'cornrows',
    image: 'https://www.afamconcept.com/cdn/shop/articles/wash-natural-hair.jpg?v=1691622662',
    emoji: '🧴',
    price: 40,
    duration: '~30 min',
    description: 'A gentle wash and blow-dry to prep or refresh your hair.',
  },

  // === COMBOS ===
  {
    id: 'combo-hands-gel-toes',
    name: 'Hands + Gel Toes',
    category: 'combos',
    image: 'https://i.pinimg.com/originals/5f/ef/90/5fef90d5c41231b46c4c99e14d41a9a7.png',
    emoji: '💅',
    price: 250,
    duration: '~2 hrs',
    description: 'Gel hands paired with gel toes in one sitting.',
  },
  {
    id: 'combo-hands-french-toes',
    name: 'Hands + French Toes',
    category: 'combos',
    image: 'https://i.pinimg.com/736x/e8/92/76/e8927672c3969c3a90b26646b1ec4d99.jpg',
    emoji: '🤍',
    price: 300,
    duration: '~2.5 hrs',
    description: 'Hands done with fresh French toes to match.',
  },
  {
    id: 'combo-hands-toes-lashes',
    name: 'Hands + Toes + Lashes',
    category: 'combos',
    image: '/images/hands-toes-lashes.jpg',
    emoji: '✨',
    price: 400,
    duration: '~3 hrs',
    description: 'Full glow package: hands, toes and a lash set.',
  },
  {
    id: 'combo-cornrows-full',
    name: 'Straight Back / Lemonade Combo',
    category: 'combos',
    image: '/images/straight-back-combo.jpg',
    emoji: '👑',
    price: 550,
    duration: '~5-6 hrs',
    description: 'Straight back or lemonade with hands, toes and lashes.',
    team: 'braiders',
  },
  {
    id: 'combo-braids-full',
    name: 'Signature Braid Combo',
    category: 'combos',
    image: '/images/signature-combo.jpg',
    emoji: '💫',
    price: 750,
    duration: '~6-7 hrs',
    description: 'Tribal, Fulani, Milano, knotless or goddess braids with hands, lashes and toes.',
    team: 'braiders',
  },
  {
    id: 'combo-hands-lashes',
    name: 'Hands + Lashes',
    category: 'combos',
    image: '/images/hands-lashes.jpg',
    emoji: '👁️',
    price: 300,
    duration: '~2 hrs',
    description: 'Fresh hands together with a fluttery lash set.',
  },

  // === INSTALLATION ===
  {
    id: 'basic-installation',
    name: 'Basic Installation',
    category: 'installation',
    image: 'https://www.stylesbyfola.co.uk/wp-content/uploads/2024/01/frontal.jpg',
    emoji: '👩‍🦱',
    price: 200,
    duration: '~3 hrs',
    description: 'Standard wig or weave installation.',
  },
  {
    id: 'styled-installation',
    name: 'Styled Installation',
    category: 'installation',
    image: 'https://coverclap.com/assets/blog/install-lace-front-wig/wig-baby-hair-customization.jpg',
    emoji: '💇‍♀️',
    price: 250,
    duration: '~4 hrs',
    description: 'Installation with custom styling & finishing.',
  },
  {
    id: 'wig-wash',
    name: 'Wig Wash & Ironing',
    category: 'installation',
    image: 'https://i.pinimg.com/736x/19/f9/17/19f9174dc64b801ea7d85860f3c2d420.jpg',
    emoji: '🧴',
    price: 120,
    duration: '~1.5 hrs',
    description: 'Deep wash and flat-iron your wig back to life.',
  },
  {
    id: 'plucking',
    name: 'Plucking',
    category: 'installation',
    image: 'https://cdn.shopify.com/s/files/1/0250/3698/0323/files/pluck-before-vs-after_600x600.jpg?v=1676451141',
    emoji: '✂️',
    price: 100,
    duration: '~1 hr',
    description: 'Precise plucking for a natural-looking hairline.',
  },
  {
    id: 'customisation',
    name: 'Customisation',
    category: 'installation',
    image: 'https://cdn.iseehair.com/media/wysiwyg/invisable-wig-knots.jpg',
    emoji: '🎨',
    price: 150,
    duration: '~2 hrs',
    description: 'Custom wig adjustments, bleaching knots & styling.',
  },

  // === LASHES ===
  {
    id: 'cluster-lashes',
    name: 'Cluster Lashes',
    category: 'lashes',
    image: 'https://www.bperfectcosmetics.com/cdn/shop/files/Cluster.png?v=1692173227',
    emoji: '👁️',
    price: 250,
    duration: '~1 hr',
    description: 'Fluttery cluster lash set for a full, glam look.',
  },
  {
    id: 'individual-lashes',
    name: 'Individual Lashes',
    category: 'lashes',
    image: 'https://i.pinimg.com/originals/b5/46/21/b54621c8ac27f0c0718336d663f0d81d.jpg',
    emoji: '✨',
    price: 300,
    duration: '~1.5 hrs',
    description: 'One-by-one individual lash extensions for a natural finish.',
  },

  // === PONDO / PONYTAIL ===
  {
    id: 'natural-pondo',
    name: 'Natural Hair Pondo',
    category: 'pondo',
    image: 'https://i.pinimg.com/originals/20/84/68/2084684f7da1154ca4d0d85a38fde564.jpg',
    emoji: '🎀',
    price: 250,
    duration: '~1.5 hrs',
    description: 'Sleek natural hair ponytail for an effortless look.',
  },
  {
    id: 'full-frontal-pondo',
    name: 'Full Frontal Pondo',
    category: 'pondo',
    image: 'https://i.pinimg.com/originals/0a/8f/5a/0a8f5a44e20fb23f3ce3c64155e4d394.jpg',
    emoji: '👑',
    price: 350,
    duration: '~2 hrs',
    description: 'Full frontal ponytail with lace front installation.',
  },
];

export const categories = [
  { id: 'all', label: 'All Services', emoji: '✨' },
  { id: 'nails', label: 'Nails', emoji: '💅' },
  { id: 'braids', label: 'Braids', emoji: '🪢' },
  { id: 'tribal', label: 'Tribal Braids', emoji: '👑' },
  { id: 'cornrows', label: 'Cornrows', emoji: '➖' },
  { id: 'combos', label: 'Combos', emoji: '💫' },
  { id: 'installation', label: 'Installation', emoji: '💇‍♀️' },
  { id: 'lashes', label: 'Lashes', emoji: '👁️' },
  { id: 'pondo', label: 'Pondo / Ponytail', emoji: '🎀' },
];

// Braiding categories are handled by the 2-person braiding team; everything
// else (nails, installations, lashes, wig styling/customisation, pondo) is
// Denzhe's own work. Combos are mixed, so those two use an explicit
// `team` override above instead of falling back to their category.
const BRAIDING_CATEGORIES: Service['category'][] = ['braids', 'tribal', 'cornrows'];

export function resolveServiceTeam(service: Service): 'denzhe' | 'braiders' {
  if (service.team) return service.team;
  return BRAIDING_CATEGORIES.includes(service.category) ? 'braiders' : 'denzhe';
}
