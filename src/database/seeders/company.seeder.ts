import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Address, Email, Phone } from '@internal/common';

import { Company, CompanyRepository, CompanyMember } from '@/domain/company';
import { ContactRepository } from '@/domain/contact';
import { Id, DomainErrorCode, ENTITY_TYPE, Industry, TaxId } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class CompanySeeder extends BaseSeeder {
  private userIds: Id[] = [];
  private contactIds: Id[] = [];

  constructor(
    connection: Connection,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Companies...');

    // Get existing users and contacts
    const users = await this.connection.collection('users').find({}).limit(10).toArray();
    this.userIds = users.map((u) =>
      Id.create(u._id.toString(), () => DomainErrorCode.USER_ID_EMPTY, () => DomainErrorCode.USER_ID_INVALID).getOrThrow(),
    );

    const contacts = await this.connection.collection('contacts').find({}).limit(50).toArray();
    this.contactIds = contacts.map((c) =>
      Id.create(c._id.toString(), () => DomainErrorCode.CONTACT_ID_EMPTY, () => DomainErrorCode.CONTACT_ID_INVALID).getOrThrow(),
    );

    if (this.userIds.length === 0) {
      console.log('⚠️  No users found. Please seed users first.');
      return;
    }

    const companiesToCreate = 30;
    const companies: Company[] = [];

    for (let i = 0; i < companiesToCreate; i++) {
      const companyId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.COMPANY_ID_EMPTY,
        () => DomainErrorCode.COMPANY_ID_INVALID,
      ).getOrThrow();

      const suffixes = ['LLC', 'Inc', 'Corp', 'Ltd'];
      const companyName = `${faker.company.name()} ${suffixes[faker.datatype.number({ min: 0, max: suffixes.length - 1 })]}`;
      const dba = faker.datatype.boolean() ? faker.company.name() : null;
      // TaxId format: XX-XXXXXXX (2 digits, dash, 7 digits)
      const taxIdPart1 = faker.datatype.number({ min: 10, max: 99 }).toString();
      const taxIdPart2 = faker.datatype.number({ min: 1000000, max: 9999999 }).toString();
      const taxId = TaxId.create(`${taxIdPart1}-${taxIdPart2}`).getOrThrow();

      const industries = ['Retail', 'Services', 'Manufacturing', 'Technology'];
      const industry = Industry.create(industries[faker.datatype.number({ min: 0, max: industries.length - 1 })]).getOrThrow();
      const service = faker.company.catchPhrase();
      const creationDate = faker.date.past(10);
      const entityTypes = Object.values(ENTITY_TYPE);
      const entityType = entityTypes[faker.datatype.number({ min: 0, max: entityTypes.length - 1 })];

      // Create address
      const address = Address.create(
        faker.address.streetAddress(),
        faker.address.secondaryAddress(),
        faker.address.stateAbbr(),
        faker.address.city(),
        faker.address.zipCode(),
        'US',
      ).getOrThrow();

      // Create phones (1-3 phones)
      const phoneCount = faker.datatype.number({ min: 1, max: 3 });
      const phoneNumbers: Phone[] = [];
      for (let j = 0; j < phoneCount; j++) {
        const phoneNumber = faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString();
        const phone = Phone.create('+1', 'US', phoneNumber).getOrThrow();
        phoneNumbers.push(phone);
      }

      // Create emails (1-3 emails)
      const emailCount = faker.datatype.number({ min: 1, max: 3 });
      const emails: Email[] = [];
      for (let j = 0; j < emailCount; j++) {
        const email = Email.createUnverified(faker.internet.email()).getOrThrow();
        emails.push(email);
      }

      // Create members (1-5 members from existing contacts)
      const memberCount = faker.datatype.number({ min: 1, max: Math.min(5, this.contactIds.length) });
      const members: CompanyMember[] = [];
      // Select random contacts
      const shuffled = [...this.contactIds].sort(() => 0.5 - Math.random());
      const selectedContacts = shuffled.slice(0, memberCount);

      let totalPercentage = 0;
      for (let j = 0; j < memberCount; j++) {
        const percentage =
          j === memberCount - 1
            ? 100 - totalPercentage
            : Math.min(faker.datatype.number({ min: 10, max: 50 }), 100 - totalPercentage - (memberCount - j - 1) * 10);
        totalPercentage += percentage;

        const memberResult = CompanyMember.create(
          selectedContacts[j],
          faker.name.jobTitle(),
          percentage,
          faker.date.past(5).toISOString().split('T')[0],
        );
        if (memberResult.isSuccess()) {
          members.push(memberResult.getOrThrow());
        }
      }

      const createdBy = this.userIds[faker.datatype.number({ min: 0, max: this.userIds.length - 1 })];

      const companyResult = Company.create(
        companyId,
        companyName,
        dba,
        taxId,
        industry,
        service,
        creationDate.toISOString().split('T')[0],
        entityType,
        address,
        phoneNumbers,
        emails,
        members,
        createdBy,
      );

      if (companyResult.isSuccess()) {
        companies.push(companyResult.getOrThrow());
      }
    }

    // Save companies
    for (const company of companies) {
      try {
        await firstValueFrom(this.companyRepository.createOne(company));
      } catch (error) {
        console.error(`Error creating company:`, error);
      }
    }

    console.log(`✅ Created ${companies.length} companies`);
  }

  async clean(): Promise<void> {
    await this.connection.collection('companies').deleteMany({});
  }
}

