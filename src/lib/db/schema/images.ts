import { pgTable, uuid, text, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from './products';
import { productVariants } from './variants';

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));

export const insertImageSchema = createInsertSchema(productImages);
export const selectImageSchema = createSelectSchema(productImages);
