import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Phone } from '@internal/common';

import { LeadGroup, Prospect, LeadsRepository } from '@/domain/leads';
import { UserRepository } from '@/domain/user';
import { Id, DomainErrorCode } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class LeadSeeder extends BaseSeeder {
  private userIds: Id[] = [];

  constructor(
    connection: Connection,
    @Inject(InjectionConstant.LEAD_REPOSITORY)
    private readonly leadRepository: LeadsRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Leads...');

    // Get existing users
    const users = await this.connection.collection('users').find({}).limit(10).toArray();
    this.userIds = users.map((u) =>
      Id.create(u._id.toString(), () => DomainErrorCode.USER_ID_EMPTY, () => DomainErrorCode.USER_ID_INVALID).getOrThrow(),
    );

    if (this.userIds.length === 0) {
      console.log('⚠️  No users found. Please seed users first.');
      return;
    }

    const leadGroupsToCreate = 5;
    const leadGroups: LeadGroup[] = [];

    for (let i = 0; i < leadGroupsToCreate; i++) {
      const leadGroupId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.LEAD_ID_EMPTY,
        () => DomainErrorCode.LEAD_ID_INVALID,
      ).getOrThrow();

      const assignedTo = this.userIds[faker.datatype.number({ min: 0, max: this.userIds.length - 1 })];
      const fileName = `leads_${faker.random.alphaNumeric(8)}.csv`;
      const totalProspects = faker.datatype.number({ min: 10, max: 50 });

      const leadGroupResult = LeadGroup.create(leadGroupId, fileName, totalProspects, assignedTo, assignedTo);

      if (leadGroupResult.isSuccess()) {
        const leadGroup = leadGroupResult.getOrThrow();
        leadGroups.push(leadGroup);

        // Create prospects
        const prospects: Prospect[] = [];
        for (let j = 0; j < totalProspects; j++) {
          const prospectId = Id.create(
            new Types.ObjectId().toString(),
            () => DomainErrorCode.PROSPECT_ID_EMPTY,
            () => DomainErrorCode.PROSPECT_ID_INVALID,
          ).getOrThrow();

          const phoneNumber = faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString();
          const phone = Phone.create('+1', 'US', phoneNumber).getOrThrow();

          const prospectResult = Prospect.create(
            prospectId,
            leadGroup.id,
            faker.company.name(),
            `${faker.name.firstName()} ${faker.name.lastName()}`,
            faker.internet.email(),
            phone,
          );

          if (prospectResult.isSuccess()) {
            prospects.push(prospectResult.getOrThrow());
          }
        }

        // Save lead group and prospects
        try {
          await firstValueFrom(this.leadRepository.createLeadGroup(leadGroup));
          await firstValueFrom(this.leadRepository.saveProspects(prospects));
        } catch (error) {
          console.error(`Error creating lead group:`, error);
        }
      }
    }

    console.log(`✅ Created ${leadGroups.length} lead groups`);
  }

  async clean(): Promise<void> {
    await this.connection.collection('leads').deleteMany({});
    await this.connection.collection('prospects').deleteMany({});
  }
}

