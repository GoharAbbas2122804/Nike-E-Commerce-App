import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  hexCode: text('hex_code').notNull(),
});

export const insertColorSchema = createInsertSchema(colors);
export const selectColorSchema = createSelectSchema(colors);
