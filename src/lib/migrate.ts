import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './db';

export async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}