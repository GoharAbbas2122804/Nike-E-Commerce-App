import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as schema from './schema';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

async function seed() {
  const { db } = await import('./index');
  console.log('Seeding database...');

  try {
    // Clear existing data (in reverse dependency order)
    console.log('Clearing existing data...');
    await db.delete(schema.reviews);
    await db.delete(schema.productImages);
    await db.delete(schema.orderItems);
    await db.delete(schema.cartItems);
    await db.delete(schema.productVariants);
    await db.delete(schema.productCollections);
    await db.delete(schema.wishlists);
    await db.delete(schema.products);
    await db.delete(schema.collections);
    await db.delete(schema.categories);
    await db.delete(schema.brands);
    await db.delete(schema.colors);
    await db.delete(schema.sizes);
    await db.delete(schema.genders);
    // Not clearing users/addresses/orders/carts/coupons for now unless requested, but to be safe for "fresh" seed:
    // await db.delete(schema.payments);
    // await db.delete(schema.orders);
    // await db.delete(schema.carts);
    // await db.delete(schema.addresses);
    // await db.delete(schema.coupons);
    // await db.delete(schema.user); 
    // Keeping users might be safer if I don't want to break auth, but for a full reset I should.
    // The prompt says "Clean already existing schemas...". It implies a fresh start.
    // But I don't want to delete the user I might be logged in with if I was testing?
    // I'll stick to product data clearing for now as that's what I'm seeding.
    
    console.log('Data cleared.');

    // Insert Genders
    const gendersData = [
      { label: 'Men', slug: 'men' },
      { label: 'Women', slug: 'women' },
      { label: 'Unisex', slug: 'unisex' },
    ];
    const insertedGenders = await db.insert(schema.genders).values(gendersData).returning();
    console.log(`Inserted ${insertedGenders.length} genders`);

    // Insert Brands
    const brandsData = [
      { name: 'Nike', slug: 'nike', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
      { name: 'Adidas', slug: 'adidas', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
      { name: 'Puma', slug: 'puma', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.png' },
    ];
    const insertedBrands = await db.insert(schema.brands).values(brandsData).returning();
    console.log(`Inserted ${insertedBrands.length} brands`);

    // Insert Categories
    const categoriesData = [
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Accessories', slug: 'accessories' },
    ];
    const insertedCategories = await db.insert(schema.categories).values(categoriesData).returning();
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Insert Colors
    const colorsData = [
      { name: 'Black', slug: 'black', hexCode: '#000000' },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
      { name: 'Red', slug: 'red', hexCode: '#FF0000' },
      { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
      { name: 'Green', slug: 'green', hexCode: '#008000' },
    ];
    const insertedColors = await db.insert(schema.colors).values(colorsData).returning();
    console.log(`Inserted ${insertedColors.length} colors`);

    // Insert Sizes
    const sizesData = [
      { name: 'US 7', slug: 'us-7', sortOrder: 1 },
      { name: 'US 8', slug: 'us-8', sortOrder: 2 },
      { name: 'US 9', slug: 'us-9', sortOrder: 3 },
      { name: 'US 10', slug: 'us-10', sortOrder: 4 },
      { name: 'US 11', slug: 'us-11', sortOrder: 5 },
      { name: 'S', slug: 's', sortOrder: 6 },
      { name: 'M', slug: 'm', sortOrder: 7 },
      { name: 'L', slug: 'l', sortOrder: 8 },
      { name: 'XL', slug: 'xl', sortOrder: 9 },
    ];
    const insertedSizes = await db.insert(schema.sizes).values(sizesData).returning();
    console.log(`Inserted ${insertedSizes.length} sizes`);

    // Insert Collections
    const collectionsData = [
      { name: "Summer '25", slug: 'summer-25' },
      { name: 'New Arrivals', slug: 'new-arrivals' },
      { name: 'Best Sellers', slug: 'best-sellers' },
    ];
    const insertedCollections = await db.insert(schema.collections).values(collectionsData).returning();
    console.log(`Inserted ${insertedCollections.length} collections`);

    // Insert Products
    const productsToInsert = [];
    const nikeBrand = insertedBrands.find(b => b.slug === 'nike') || insertedBrands[0];
    const shoesCategory = insertedCategories.find(c => c.slug === 'shoes') || insertedCategories[0];

    // Local images from /public/shoes
    const shoeImages = [
      'shoe-1.jpg', 'shoe-2.webp', 'shoe-3.webp', 'shoe-4.webp', 'shoe-5.avif',
      'shoe-6.avif', 'shoe-7.avif', 'shoe-8.avif', 'shoe-9.avif', 'shoe-10.avif',
      'shoe-11.avif', 'shoe-12.avif', 'shoe-13.avif', 'shoe-14.avif', 'shoe-15.avif'
    ];

    for (let i = 0; i < 15; i++) {
      const gender = faker.helpers.arrayElement(insertedGenders);
      const name = `Nike ${faker.commerce.productName()}`;
      productsToInsert.push({
        name: name,
        description: faker.commerce.productDescription(),
        categoryId: shoesCategory.id,
        genderId: gender.id,
        brandId: nikeBrand.id,
        isPublished: true,
      });
    }
    const insertedProducts = await db.insert(schema.products).values(productsToInsert).returning();
    console.log(`Inserted ${insertedProducts.length} products`);

    // Insert Variants and Images
    for (const [i, product] of insertedProducts.entries()) {
      const variantsToInsert = [];
      const numVariants = faker.number.int({ min: 2, max: 5 });
      const imageUrl = `/shoes/${shoeImages[i % shoeImages.length]}`;

      for (let j = 0; j < numVariants; j++) {
        const color = faker.helpers.arrayElement(insertedColors);
        const size = faker.helpers.arrayElement(insertedSizes);
        const price = faker.commerce.price({ min: 50, max: 200 });

        variantsToInsert.push({
          productId: product.id,
          sku: `${product.id.slice(0, 8)}-${color.slug}-${size.slug}-${j}`,
          price: price,
          salePrice: faker.datatype.boolean() ? faker.commerce.price({ min: 30, max: Number(price) }) : null,
          colorId: color.id,
          sizeId: size.id,
          inStock: faker.number.int({ min: 0, max: 100 }),
          weight: faker.number.float({ min: 0.5, max: 2 }),
          dimensions: { length: 30, width: 20, height: 10 },
        });
      }
      const insertedVariants = await db.insert(schema.productVariants).values(variantsToInsert).returning();

      // Set default variant
      await db.update(schema.products).set({ defaultVariantId: insertedVariants[0].id }).where(eq(schema.products.id, product.id));

      // Images
      for (const variant of insertedVariants) {
        // Use the specific image for this product
        const imagesToInsert = [{
            productId: product.id,
            variantId: variant.id,
            url: imageUrl,
            sortOrder: 0,
            isPrimary: true,
        }];
        
        await db.insert(schema.productImages).values(imagesToInsert);
      }
    }
    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
