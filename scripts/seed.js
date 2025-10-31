const { seedProducts } = require('../src/lib/seed.ts');

seedProducts().then(() => {
  console.log('Seeding completed!');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});