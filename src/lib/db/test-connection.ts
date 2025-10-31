import { db } from './index';
import { products } from './schema';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.select().from(products).limit(1);
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}