import { pgTable, uuid, text, numeric, pgEnum, timestamp, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').unique().notNull(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  maxUsage: integer('max_usage').notNull(),
  usedCount: integer('used_count').default(0).notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons);
export const selectCouponSchema = createSelectSchema(coupons);
