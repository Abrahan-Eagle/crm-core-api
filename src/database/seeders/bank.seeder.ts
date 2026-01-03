import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Address, Email, Phone } from '@internal/common';

import { Bank, BankRepository, BankContact, BankConstraints, BANK_CLASSIFICATION, BankTerritory, BANK_SUPPORTED_ID } from '@/domain/bank';
import { Id, DomainErrorCode, Industry, PRODUCT_TYPE } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class BankSeeder extends BaseSeeder {
  constructor(
    connection: Connection,
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Banks...');

    const banksToCreate = 15;
    const banks: Bank[] = [];

    const bankNames = [
      'First National Bank',
      'Merchant Capital Solutions',
      'Business Funding Partners',
      'Commercial Lending Group',
      'Small Business Finance Co',
      'Rapid Funding Solutions',
      'Elite Business Capital',
      'Premier Commercial Bank',
      'Strategic Funding Inc',
      'National Business Bank',
      'Quick Capital Lenders',
      'Enterprise Finance Group',
      'Professional Funding Co',
      'Advanced Business Loans',
      'Prime Commercial Capital',
    ];

    for (let i = 0; i < banksToCreate; i++) {
      const bankId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.BANK_ID_EMPTY,
        () => DomainErrorCode.BANK_ID_INVALID,
      ).getOrThrow();

      const bankName = bankNames[i] || faker.company.name();
      const manager = `${faker.name.firstName()} ${faker.name.lastName()}`;
      const bankTypes = ['LENDER', 'BROKER'];
      const bankType = bankTypes[faker.datatype.number({ min: 0, max: bankTypes.length - 1 })];

      // Create address
      const address = Address.create(
        faker.address.streetAddress(),
        faker.address.secondaryAddress(),
        faker.address.stateAbbr(),
        faker.address.city(),
        faker.address.zipCode(),
        'US',
      ).getOrThrow();

      // Create contacts (1-2 contacts)
      const contactCount = faker.datatype.number({ min: 1, max: 2 });
      const contacts: BankContact[] = [];
      for (let j = 0; j < contactCount; j++) {
        const phoneNumber = faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString();
        const phone = Phone.create('+1', 'US', phoneNumber).getOrThrow();
        const email = Email.createUnverified(faker.internet.email()).getOrThrow();

        const contact = BankContact.create(
          faker.name.firstName(),
          faker.name.lastName(),
          [phone],
          [email],
        ).getOrThrow();
        contacts.push(contact);
      }

      // Create basic constraints
      const classifications = [BANK_CLASSIFICATION.A, BANK_CLASSIFICATION.B];
      const territory = BankTerritory.create('US', []).getOrThrow();
      const territories = [territory];
      const allowedIndustries = [Industry.create('Retail').getOrThrow(), Industry.create('Services').getOrThrow()];
      const supportedIDs = [BANK_SUPPORTED_ID.SSN, BANK_SUPPORTED_ID.DRIVER_LICENSE];
      const constraints = BankConstraints.create(
        classifications, // classifications
        territories, // territories
        null, // deposits
        faker.datatype.number({ min: 10000, max: 5000000 }), // loanLimit
        true, // hasLoanLimit
        faker.datatype.number({ min: 1000, max: 50000 }), // minimumLoan
        faker.datatype.number({ min: 6, max: 24 }), // minimumMonthsInBusiness
        0, // minimumDailyBalance
        0, // maximumNegativeDays
        allowedIndustries, // allowedIndustries
        supportedIDs, // supportedIDs
        [1, 2, 3, 4, 5], // positions
        [], // blockedProducts (empty array is valid)
      ).getOrThrow();

      const bankResult = Bank.create(
        bankId,
        bankName,
        manager,
        address,
        contacts,
        bankType,
        constraints,
      );

      if (bankResult.isSuccess()) {
        banks.push(bankResult.getOrThrow());
      }
    }

    // Save banks
    for (const bank of banks) {
      try {
        await firstValueFrom(this.bankRepository.createOne(bank));
      } catch (error) {
        console.error(`Error creating bank:`, error);
      }
    }

    console.log(`✅ Created ${banks.length} banks`);
  }

  async clean(): Promise<void> {
    await this.connection.collection('banks').deleteMany({});
  }
}

