import { db } from './db';
import { products } from './db/schema';

const nikeProducts = [
  {
    name: 'Air Jordan 1 Retro High OG',
    description: 'The Air Jordan 1 Retro High OG brings back the classic silhouette with premium materials and iconic colorways.',
    price: '170.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-Pph9LM.png',
    category: 'Basketball',
    brand: 'Nike',
  },
  {
    name: 'Nike Air Max 90',
    description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU details.',
    price: '120.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/zwxes8uud05rkuei1mpt/air-max-90-shoes-6n3vKB.png',
    category: 'Lifestyle',
    brand: 'Nike',
  },
  {
    name: 'Nike Dunk Low',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
    price: '110.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/dunk-low-shoes-5FQWGR.png',
    category: 'Lifestyle',
    brand: 'Nike',
  },
  {
    name: 'Nike Air Force 1 \'07',
    description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
    price: '110.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
    category: 'Lifestyle',
    brand: 'Nike',
  },
  {
    name: 'Nike React Infinity Run Flyknit 3',
    description: 'A comfortable ride that\'s designed to help keep you running. More foam and improved upper details provide a secure and cushioned feel.',
    price: '160.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8439f823-86cf-4086-81d2-4f9ff9a66866/react-infinity-run-flyknit-3-road-running-shoes-XJgHJC.png',
    category: 'Running',
    brand: 'Nike',
  },
  {
    name: 'Nike Blazer Mid \'77 Vintage',
    description: 'In the \'70s, Nike was the new shoe on the block. So new in fact, we were still breaking into the basketball scene.',
    price: '100.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/blazer-mid-77-vintage-shoes-nw30B2.png',
    category: 'Lifestyle',
    brand: 'Nike',
  },
];

export async function seedProducts() {
  try {
    console.log('Seeding products...');
    await db.insert(products).values(nikeProducts);
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Run this if called directly
if (require.main === module) {
  seedProducts().then(() => process.exit(0));
}