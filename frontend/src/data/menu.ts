export interface Customization {
  id: string;
  label: string;
  type: 'radio' | 'checkbox';
  options: {
    id: string;
    label: string;
    extraPrice: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isFeatured: boolean;
  spiceLevel: 0 | 1 | 2 | 3;
  image: string;
  customizations: Customization[];
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
}

export const categories: MenuCategory[] = [
  { id: 'chefs-specials', name: "Chef's Specials", description: "Our kitchen's proudest creations" },
  { id: 'starters', name: 'Starters', description: 'Small plates to kick things off' },
  { id: 'mains-veg', name: 'Mains — Veg', description: 'Hearty vegetarian mains' },
  { id: 'mains-non-veg', name: 'Mains — Non-Veg', description: 'From the tandoor and the wok' },
  { id: 'breads', name: 'Breads', description: 'Fresh from the clay oven' },
  { id: 'desserts', name: 'Desserts', description: 'A sweet finish' },
  { id: 'beverages', name: 'Beverages', description: 'Crafted drinks & classics' },
];

const spiceCustomization: Customization = {
  id: 'spice-level',
  label: 'Spice Level',
  type: 'radio',
  options: [
    { id: 'mild', label: 'Mild', extraPrice: 0 },
    { id: 'medium', label: 'Medium', extraPrice: 0 },
    { id: 'hot', label: 'Hot', extraPrice: 0 },
    { id: 'extra-hot', label: 'Extra Hot 🔥', extraPrice: 0 },
  ],
};

const sizeCustomization: Customization = {
  id: 'portion-size',
  label: 'Portion Size',
  type: 'radio',
  options: [
    { id: 'half', label: 'Half', extraPrice: 0 },
    { id: 'full', label: 'Full', extraPrice: 100 },
  ],
};

const breadAddOns: Customization = {
  id: 'bread-extras',
  label: 'Extra',
  type: 'checkbox',
  options: [
    { id: 'extra-butter', label: 'Extra Butter', extraPrice: 20 },
    { id: 'extra-cheese', label: 'Cheese Stuffed', extraPrice: 50 },
  ],
};

const drinkSize: Customization = {
  id: 'drink-size',
  label: 'Size',
  type: 'radio',
  options: [
    { id: 'regular', label: 'Regular', extraPrice: 0 },
    { id: 'large', label: 'Large', extraPrice: 60 },
  ],
};

export const menuItems: MenuItem[] = [
  // ─── Chef's Specials ───
  {
    id: 'cs-1',
    name: 'Dal Makhani',
    description: 'Slow-cooked 24-hour black lentils finished with cream and a wisp of smoke. The dish that started it all.',
    price: 345,
    category: 'chefs-specials',
    isVeg: true,
    isFeatured: true,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
    tags: ['Bestseller', 'Signature'],
  },
  {
    id: 'cs-2',
    name: 'Raan-e-Tandoori',
    description: 'Whole leg of lamb marinated for 48 hours in a spiced yoghurt rub, roasted in the tandoor until it falls off the bone.',
    price: 895,
    category: 'chefs-specials',
    isVeg: false,
    isFeatured: true,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
    tags: ['Chef\'s Pick', 'Serves 2'],
  },
  {
    id: 'cs-3',
    name: 'Smoked Paneer Tikka',
    description: 'Charcoal-kissed cottage cheese with bell peppers and onion, finished with a live coal smoke.',
    price: 385,
    category: 'chefs-specials',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
    tags: ['Signature'],
  },

  // ─── Starters ───
  {
    id: 'st-1',
    name: 'Paneer Tikka',
    description: 'Cubes of fresh paneer marinated in hung curd and tandoori spices, grilled to a perfect char.',
    price: 295,
    category: 'starters',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
  },
  {
    id: 'st-2',
    name: 'Chicken Malai Tikka',
    description: 'Cream-marinated chicken pieces with a whisper of cardamom and mace. Melt-in-your-mouth tender.',
    price: 345,
    category: 'starters',
    isVeg: false,
    isFeatured: true,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
    tags: ['Popular'],
  },
  {
    id: 'st-3',
    name: 'Amritsari Fish Fry',
    description: 'Crisp-battered river fish seasoned with ajwain and chaat masala. Golden, flaky, addictive.',
    price: 395,
    category: 'starters',
    isVeg: false,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
  },
  {
    id: 'st-4',
    name: 'Dahi Kebab',
    description: 'Soft hung-curd patties studded with cashews and raisins, pan-fried until lightly crisp.',
    price: 275,
    category: 'starters',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
  },
  {
    id: 'st-5',
    name: 'Mutton Galouti Kebab',
    description: 'Lucknow\'s legendary melt-on-the-tongue kebab, made with 36 spices and raw papaya.',
    price: 425,
    category: 'starters',
    isVeg: false,
    isFeatured: false,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
    tags: ['Royal Recipe'],
  },

  // ─── Mains — Veg ───
  {
    id: 'mv-1',
    name: 'Palak Paneer',
    description: 'Silky spinach gravy with cubes of homemade paneer and a temper of garlic.',
    price: 295,
    category: 'mains-veg',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
  },
  {
    id: 'mv-2',
    name: 'Shahi Paneer',
    description: 'Paneer in a rich cashew-and-tomato gravy with a thread of saffron cream.',
    price: 325,
    category: 'mains-veg',
    isVeg: true,
    isFeatured: true,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
    tags: ['Rich & Creamy'],
  },
  {
    id: 'mv-3',
    name: 'Baingan Bharta',
    description: 'Smoky roasted aubergine mash tempered with tomatoes, onions, and green chillies.',
    price: 265,
    category: 'mains-veg',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
  },
  {
    id: 'mv-4',
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with cumin, garlic, and dried red chillies. Simple. Perfect.',
    price: 225,
    category: 'mains-veg',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
  },

  // ─── Mains — Non-Veg ───
  {
    id: 'mn-1',
    name: 'Butter Chicken',
    description: 'Tandoori chicken pieces swimming in a velvety tomato-butter gravy with a hint of fenugreek.',
    price: 375,
    category: 'mains-non-veg',
    isVeg: false,
    isFeatured: true,
    spiceLevel: 1,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
    tags: ['Bestseller'],
  },
  {
    id: 'mn-2',
    name: 'Mutton Rogan Josh',
    description: 'A Kashmiri classic — slow-braised lamb in a deep red sauce of Kashmiri chillies and fennel.',
    price: 445,
    category: 'mains-non-veg',
    isVeg: false,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
    tags: ['Kashmiri'],
  },
  {
    id: 'mn-3',
    name: 'Prawn Masala',
    description: 'Juicy tiger prawns in a coastal coconut-and-kokum gravy. Finished with curry leaves.',
    price: 495,
    category: 'mains-non-veg',
    isVeg: false,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
    customizations: [spiceCustomization, sizeCustomization],
  },
  {
    id: 'mn-4',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati layered with spiced chicken, fried onions, and saffron. Sealed and slow-cooked.',
    price: 395,
    category: 'mains-non-veg',
    isVeg: false,
    isFeatured: false,
    spiceLevel: 2,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop',
    customizations: [spiceCustomization],
    tags: ['Dum Pukht'],
  },

  // ─── Breads ───
  {
    id: 'br-1',
    name: 'Butter Naan',
    description: 'Soft leavened bread brushed with melted butter, straight from the tandoor.',
    price: 65,
    category: 'breads',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
    customizations: [breadAddOns],
  },
  {
    id: 'br-2',
    name: 'Garlic Naan',
    description: 'Butter naan\'s bolder sibling — loaded with roasted garlic and coriander.',
    price: 85,
    category: 'breads',
    isVeg: true,
    isFeatured: true,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&h=400&fit=crop',
    customizations: [breadAddOns],
    tags: ['Popular'],
  },
  {
    id: 'br-3',
    name: 'Laccha Paratha',
    description: 'Flaky, layered whole-wheat bread with a slight crunch on the outside.',
    price: 75,
    category: 'breads',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    customizations: [breadAddOns],
  },
  {
    id: 'br-4',
    name: 'Missi Roti',
    description: 'Gram flour flatbread spiced with onion and cumin. Rustic and satisfying.',
    price: 70,
    category: 'breads',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    customizations: [],
  },

  // ─── Beverages ───
  {
    id: 'bv-1',
    name: 'Masala Chai',
    description: 'Our house-blend chai with cardamom, ginger, and a touch of cinnamon. Strong and soul-warming.',
    price: 95,
    category: 'beverages',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop',
    customizations: [drinkSize],
  },
  {
    id: 'bv-2',
    name: 'Mango Lassi',
    description: 'Thick yoghurt blended with Alphonso mango pulp and a hint of cardamom.',
    price: 165,
    category: 'beverages',
    isVeg: true,
    isFeatured: true,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&h=400&fit=crop',
    customizations: [drinkSize],
    tags: ['Summer Special'],
  },
  {
    id: 'bv-3',
    name: 'Fresh Lime Soda',
    description: 'Your choice — sweet, salty, or mixed. Hand-pressed lime with soda water.',
    price: 95,
    category: 'beverages',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: '/images/fresh-lime-soda.jpg',
    customizations: [
      {
        id: 'lime-style',
        label: 'Style',
        type: 'radio',
        options: [
          { id: 'sweet', label: 'Sweet', extraPrice: 0 },
          { id: 'salty', label: 'Salty', extraPrice: 0 },
          { id: 'mixed', label: 'Mixed', extraPrice: 0 },
        ],
      },
      drinkSize,
    ],
  },
  {
    id: 'bv-4',
    name: 'Whiskey Sour',
    description: 'Classic cocktail with bourbon, fresh lemon, egg white foam, and Angostura bitters.',
    price: 445,
    category: 'beverages',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop',
    customizations: [],
    tags: ['Bar'],
  },
  {
    id: 'bv-5',
    name: 'Old Fashioned',
    description: 'Bourbon muddled with sugar and bitters, served over a single large ice cube with an orange twist.',
    price: 495,
    category: 'beverages',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop',
    customizations: [],
    tags: ['Bar', 'Classic'],
  },

  // ─── Desserts ───
  {
    id: 'ds-1',
    name: 'Gulab Jamun',
    description: 'Deep-fried milk dumplings soaked in rose-cardamom syrup. Served warm with a scoop of kulfi.',
    price: 195,
    category: 'desserts',
    isVeg: true,
    isFeatured: true,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1666190050431-e9e1af218f31?w=600&h=400&fit=crop',
    customizations: [],
    tags: ['Served Warm'],
  },
  {
    id: 'ds-2',
    name: 'Rasmalai',
    description: 'Delicate cottage cheese discs floating in chilled saffron-pistachio milk.',
    price: 215,
    category: 'desserts',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=400&fit=crop',
    customizations: [],
  },
  {
    id: 'ds-3',
    name: 'Kulfi Falooda',
    description: 'Dense saffron-pistachio kulfi served with rose-soaked vermicelli and basil seeds.',
    price: 225,
    category: 'desserts',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&h=400&fit=crop',
    customizations: [],
  },
  {
    id: 'ds-4',
    name: 'Phirni',
    description: 'Chilled rice pudding set in clay pots, flavoured with cardamom and topped with silver leaf.',
    price: 175,
    category: 'desserts',
    isVeg: true,
    isFeatured: false,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
    customizations: [],
    tags: ['Clay Pot Served'],
  },
];

export function getItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.category === categoryId);
}

export function getItemById(itemId: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === itemId);
}

export function getFeaturedItems(): MenuItem[] {
  return menuItems.filter((item) => item.isFeatured);
}
