import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Address, Email, Phone } from '@internal/common';

import { Contact, ContactRepository } from '@/domain/contact';
import { Id, DomainErrorCode } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class ContactSeeder extends BaseSeeder {
  private userIds: Id[] = [];

  constructor(
    connection: Connection,
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: any, // UserRepository for getting users
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Contacts...');

    // Get existing users
    const users = await this.connection.collection('users').find({}).limit(10).toArray();
    this.userIds = users.map((u) =>
      Id.create(u._id.toString(), () => DomainErrorCode.USER_ID_EMPTY, () => DomainErrorCode.USER_ID_INVALID).getOrThrow(),
    );

    if (this.userIds.length === 0) {
      console.log('⚠️  No users found. Please seed users first.');
      return;
    }

    const contactsToCreate = 50;
    const contacts: Contact[] = [];

    for (let i = 0; i < contactsToCreate; i++) {
      const contactId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.CONTACT_ID_EMPTY,
        () => DomainErrorCode.CONTACT_ID_INVALID,
      ).getOrThrow();

      // Generate birthdate (age 21-99)
      const age = faker.datatype.number({ min: 21, max: 99 });
      const birthdate = new Date();
      birthdate.setFullYear(birthdate.getFullYear() - age);

      // Generate SSN (9 digits)
      const ssn = faker.datatype.number({ min: 100000000, max: 999999999 }).toString();

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
      const phones: Phone[] = [];
      for (let j = 0; j < phoneCount; j++) {
        const phoneNumber = faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString();
        const phone = Phone.create('+1', 'US', phoneNumber).getOrThrow();
        phones.push(phone);
      }

      // Create emails (1-3 emails)
      const emailCount = faker.datatype.number({ min: 1, max: 3 });
      const emails: Email[] = [];
      for (let j = 0; j < emailCount; j++) {
        const email = Email.createUnverified(faker.internet.email()).getOrThrow();
        emails.push(email);
      }

      const createdBy = this.userIds[faker.datatype.number({ min: 0, max: this.userIds.length - 1 })];

      const contactResult = Contact.create(
        contactId,
        faker.name.firstName(),
        faker.name.lastName(),
        birthdate.toISOString().split('T')[0],
        ssn,
        address,
        phones,
        emails,
        createdBy,
      );

      if (contactResult.isSuccess()) {
        contacts.push(contactResult.getOrThrow());
      }
    }

    // Save contacts
    for (const contact of contacts) {
      try {
        await firstValueFrom(this.contactRepository.createOne(contact));
      } catch (error) {
        console.error(`Error creating contact:`, error);
      }
    }

    console.log(`✅ Created ${contacts.length} contacts`);
  }

  async clean(): Promise<void> {
    await this.connection.collection('contacts').deleteMany({});
  }
}

