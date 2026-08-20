export interface Restaurant {
  slug: string;
  name: string;
  tagline: string;
  cuisine: string;
  openNow: boolean;
  heroImages: string[];
}

export const restaurant: Restaurant = {
  slug: 'tandoori-trails',
  name: 'Tandoori Trails',
  tagline: 'Wood-fired flavours, modern plates',
  cuisine: 'North Indian • Mughlai • Bar',
  openNow: true,
  heroImages: [
    '/images/restaurant-interior-1.jpg',
    '/images/restaurant-interior-2.jpg',
    '/images/restaurant-bar.jpg',
  ],
};
