import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * Base Seeder class that all seeders should extend
 */
@Injectable()
export abstract class BaseSeeder {
  constructor(@InjectConnection() protected readonly connection: Connection) {}

  /**
   * Seed method that must be implemented by each seeder
   */
  abstract seed(): Promise<void>;

  /**
   * Optional: Clean method to remove seeded data
   */
  async clean?(): Promise<void>;
}

