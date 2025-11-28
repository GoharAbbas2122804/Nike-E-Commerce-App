import { pgTable, uuid, text, numeric, integer, real, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  sku: text('sku').unique().notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').references(() => colors.id).notNull(),
  sizeId: uuid('size_id').references(() => sizes.id).notNull(),
  inStock: integer('in_stock').notNull(),
  weight: real('weight').notNull(),
  dimensions: jsonb('dimensions').$type<{ length: number; width: number; height: number }>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
}));

export const insertVariantSchema = createInsertSchema(productVariants);
export const selectVariantSchema = createSelectSchema(productVariants);
