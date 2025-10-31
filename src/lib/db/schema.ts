import { pgTable, serial, text, decimal, timestamp, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  image: varchar('image', { length: 500 }),
  category: varchar('category', { length: 100 }),
  brand: varchar('brand', { length: 100 }).default('Nike'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});