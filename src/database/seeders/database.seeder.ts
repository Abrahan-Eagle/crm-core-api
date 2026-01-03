import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { UserSeeder } from './user.seeder';
import { ContactSeeder } from './contact.seeder';
import { CompanySeeder } from './company.seeder';
import { BankSeeder } from './bank.seeder';
import { ApplicationSeeder } from './application.seeder';
import { ApplicationTestingSeeder } from './application-testing.seeder';
import { LeadSeeder } from './lead.seeder';

/**
 * Main Database Seeder
 * Orchestrates all seeders execution
 */
@Injectable()
export class DatabaseSeeder {
  private seeders: Array<{ name: string; seeder: BaseSeeder }> = [];

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly userSeeder: UserSeeder,
    private readonly contactSeeder: ContactSeeder,
    private readonly companySeeder: CompanySeeder,
    private readonly bankSeeder: BankSeeder,
    private readonly applicationSeeder: ApplicationSeeder,
    private readonly applicationTestingSeeder: ApplicationTestingSeeder,
    private readonly leadSeeder: LeadSeeder,
  ) {
    this.seeders = [
      { name: 'Users', seeder: this.userSeeder },
      { name: 'Contacts', seeder: this.contactSeeder },
      { name: 'Companies', seeder: this.companySeeder },
      { name: 'Banks', seeder: this.bankSeeder },
      // Applications seeder is skipped - requires documents and complex setup
      // { name: 'Applications', seeder: this.applicationSeeder },
      // Testing seeder for cancelOffer fix - creates apps with notifications and offers
      { name: 'Applications (Testing)', seeder: this.applicationTestingSeeder },
      { name: 'Leads', seeder: this.leadSeeder },
    ];
  }

  /**
   * Run all seeders
   */
  async run(): Promise<void> {
    console.log('🚀 Starting database seeding...\n');

    try {
      for (const { name, seeder } of this.seeders) {
        console.log(`📦 Seeding ${name}...`);
        await seeder.seed();
        console.log(`✅ ${name} seeded successfully\n`);
      }

      console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  /**
   * Clean all seeded data
   */
  async clean(): Promise<void> {
    console.log('🧹 Cleaning database...\n');

    try {
      // Run seeders in reverse order
      for (const { name, seeder } of this.seeders.reverse()) {
        if (seeder.clean) {
          console.log(`🗑️  Cleaning ${name}...`);
          await seeder.clean();
          console.log(`✅ ${name} cleaned\n`);
        }
      }

      console.log('✨ Database cleaned successfully!');
    } catch (error) {
      console.error('❌ Error cleaning database:', error);
      throw error;
    }
  }
}

import { BaseSeeder } from './base.seeder';

