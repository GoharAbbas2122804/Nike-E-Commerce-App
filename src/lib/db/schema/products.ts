import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { categories } from './categories';
import { brands } from './brands';
import { genders } from './filters/genders';
import { productVariants } from './variants';
import { productImages } from './images';
import { reviews } from './reviews';
import { productCollections } from './collections';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  genderId: uuid('gender_id').references(() => genders.id).notNull(),
  brandId: uuid('brand_id').references(() => brands.id).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  defaultVariantId: uuid('default_variant_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  reviews: many(reviews),
  collections: many(productCollections),
}));

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
