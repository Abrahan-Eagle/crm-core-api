import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConstant, MongoIdService, MongoTransactionContextStorage, MongoConfig } from '@internal/mongo';
import { CommonModule, ConfigManager } from '@internal/common';

import { InjectionConstant } from '@/app/common';
import { ExtendedAuthContextStorage } from '@/infra/common';
import {
  ApplicationSchema,
  BankSchema,
  CompanySchema,
  ContactSchema,
  LeadGroupSchema,
  ProspectSchema,
  UserSchema,
  IndustrySchema,
  MongoApplicationRepository,
  MongoBankRepository,
  MongoCompanyRepository,
  MongoContactRepository,
  MongoLeadsRepository,
  MongoUserRepository,
  MongoIndustryRepository,
  UserMapper,
  ContactMapper,
  CompanyMapper,
  BankMapper,
  ApplicationMapper,
  LeadGroupMapper,
  ProspectMapper,
  // Common mappers
  AddressMapper,
  EmailMapper,
  PhoneMapper,
  TaxIdMapper,
  IndustryMapper,
  NoteMapper,
  // Specific mappers
  CompanyMemberMapper,
  CompanyFileMapper,
  ContactFileMapper,
  BankContactMapper,
  BankConstraintsMapper,
  BankFileMapper,
  BankBlacklistMapper,
  ApplicationFileMapper,
  ApplicationReferralMapper,
  OfferMapper,
  BankNotificationMapper,
  FilledApplicationFileMapper,
  BankConstraintsDepositsMapper,
  DepositConstraintByIndustryMapper,
  BankTerritoryMapper,
  CallLogMapper,
} from '@/infra/adapters';

import { DatabaseSeeder } from './database.seeder';
import { UserSeeder } from './user.seeder';
import { ContactSeeder } from './contact.seeder';
import { CompanySeeder } from './company.seeder';
import { BankSeeder } from './bank.seeder';
import { ApplicationSeeder } from './application.seeder';
import { ApplicationTestingSeeder } from './application-testing.seeder';
import { LeadSeeder } from './lead.seeder';

@Module({
  imports: [
    CommonModule.forRoot({
      configs: [MongoConfig],
    }),
    MongooseModule.forRoot(ConfigManager.get(MongoConfig).uri, {
      lazyConnection: false,
    }),
    MongooseModule.forFeature([
      { name: InjectionConstant.USER_MODEL, schema: UserSchema },
      { name: InjectionConstant.CONTACT_MODEL, schema: ContactSchema },
      { name: InjectionConstant.COMPANY_MODEL, schema: CompanySchema },
      { name: InjectionConstant.BANK_MODEL, schema: BankSchema },
      { name: InjectionConstant.APPLICATION_MODEL, schema: ApplicationSchema },
      { name: InjectionConstant.LEAD_MODEL, schema: LeadGroupSchema },
      { name: InjectionConstant.PROSPECT_MODEL, schema: ProspectSchema },
      { name: InjectionConstant.INDUSTRY_MODEL, schema: IndustrySchema },
    ]),
  ],
  providers: [
    { provide: MongoConstant.ID_SERVICE, useClass: MongoIdService },
    MongoTransactionContextStorage,
    ExtendedAuthContextStorage,
    // Common mappers (no dependencies)
    AddressMapper,
    EmailMapper,
    PhoneMapper,
    TaxIdMapper,
    IndustryMapper,
    NoteMapper,
    // File mappers (no dependencies)
    ContactFileMapper,
    CompanyFileMapper,
    BankFileMapper,
    ApplicationFileMapper,
    FilledApplicationFileMapper,
    // Member mappers
    CompanyMemberMapper,
  // Bank mappers
  BankContactMapper,
  BankConstraintsDepositsMapper,
  DepositConstraintByIndustryMapper,
  BankTerritoryMapper,
  BankConstraintsMapper,
  BankBlacklistMapper,
  // Application mappers
  ApplicationReferralMapper,
  OfferMapper,
  BankNotificationMapper,
    // Lead mappers
    CallLogMapper,
    // Entity mappers (with dependencies)
    UserMapper,
    ContactMapper,
    CompanyMapper,
    BankMapper,
    ApplicationMapper,
    LeadGroupMapper,
    ProspectMapper,
    // Repositories
    { provide: InjectionConstant.USER_REPOSITORY, useClass: MongoUserRepository },
    { provide: InjectionConstant.INDUSTRY_REPOSITORY, useClass: MongoIndustryRepository },
    { provide: InjectionConstant.CONTACT_REPOSITORY, useClass: MongoContactRepository },
    { provide: InjectionConstant.COMPANY_REPOSITORY, useClass: MongoCompanyRepository },
    { provide: InjectionConstant.BANK_REPOSITORY, useClass: MongoBankRepository },
    { provide: InjectionConstant.APPLICATION_REPOSITORY, useClass: MongoApplicationRepository },
    { provide: InjectionConstant.LEAD_REPOSITORY, useClass: MongoLeadsRepository },
    DatabaseSeeder,
    UserSeeder,
    ContactSeeder,
    CompanySeeder,
    BankSeeder,
    ApplicationSeeder,
    ApplicationTestingSeeder,
    LeadSeeder,
  ],
  exports: [DatabaseSeeder],
})
export class SeedersModule {}

