/**
 * Database Seeder Script
 * 
 * Usage: npm run seed
 * 
 * This script populates the database with fake data for testing purposes.
 * Similar to Laravel's database seeders.
 */

import { NestFactory } from '@nestjs/core';
import { SeedersModule } from './seeders/seeders.module';
import { DatabaseSeeder } from './seeders/database.seeder';

async function bootstrap() {
  // Use SeedersModule instead of AppModule to avoid loading unnecessary dependencies
  const app = await NestFactory.createApplicationContext(SeedersModule, {
    logger: ['error', 'warn', 'log'],
  });
  
  // Get the seeder from the app context
  const seeder = app.get(DatabaseSeeder);
  
  try {
    await seeder.run();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();

