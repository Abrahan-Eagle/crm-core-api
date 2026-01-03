import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { Application, ApplicationRepository, APPLICATION_STATUS } from '@/domain/application';
import { CompanyRepository } from '@/domain/company';
import { Id, DomainErrorCode, PRODUCT_TYPE, getPeriodFromDate } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class ApplicationSeeder extends BaseSeeder {
  private companyIds: Id[] = [];
  private userIds: Id[] = [];

  constructor(
    connection: Connection,
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Applications...');

    // Get existing companies and users
    const companies = await this.connection.collection('companies').find({}).limit(30).toArray();
    this.companyIds = companies.map((c) =>
      Id.create(c._id.toString(), () => DomainErrorCode.COMPANY_ID_EMPTY, () => DomainErrorCode.COMPANY_ID_INVALID).getOrThrow(),
    );

    const users = await this.connection.collection('users').find({}).limit(10).toArray();
    this.userIds = users.map((u) =>
      Id.create(u._id.toString(), () => DomainErrorCode.USER_ID_EMPTY, () => DomainErrorCode.USER_ID_INVALID).getOrThrow(),
    );

    if (this.companyIds.length === 0) {
      console.log('⚠️  No companies found. Please seed companies first.');
      return;
    }

    const applicationsToCreate = 20;
    const applications: Application[] = [];

    for (let i = 0; i < applicationsToCreate; i++) {
      const applicationId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ).getOrThrow();

      const companyId = this.companyIds[faker.datatype.number({ min: 0, max: this.companyIds.length - 1 })];
      const trackingId = faker.random.alphaNumeric(12).toLowerCase();
      const period = getPeriodFromDate(new Date());
      const loanAmount = faker.datatype.number({ min: 1000, max: 20000000 });
      const productTypes = Object.values(PRODUCT_TYPE);
      const product = productTypes[faker.datatype.number({ min: 0, max: productTypes.length - 1 })];
      const statuses = [
        APPLICATION_STATUS.READY_TO_SEND,
        APPLICATION_STATUS.SENT,
        APPLICATION_STATUS.REPLIED,
        APPLICATION_STATUS.OFFERED,
        APPLICATION_STATUS.OFFER_ACCEPTED,
        APPLICATION_STATUS.COMPLETED,
      ];
      const status = statuses[faker.datatype.number({ min: 0, max: statuses.length - 1 })];
      const createdBy = this.userIds[faker.datatype.number({ min: 0, max: this.userIds.length - 1 })];
      const position = faker.datatype.number({ min: 1, max: 5 });

      const applicationResult = Application.create(
        applicationId,
        companyId,
        loanAmount,
        product,
        null, // referral
        [], // bankStatements
        [], // mtdStatements
        [], // creditCardStatements
        [], // additionalStatements
        createdBy,
      );

      if (applicationResult.isSuccess()) {
        const application = applicationResult.getOrThrow();
        applications.push(application);
      }
    }

    // Save applications - ApplicationRepository doesn't have createOne, so we'll skip this for now
    // Applications need to be created through the proper command handler with all required documents
    console.log(`⚠️  Note: Applications seeder is simplified. Full applications require documents and should be created through the API.`);
    console.log(`✅ Prepared ${applications.length} applications (not saved - requires documents)`);
  }

  async clean(): Promise<void> {
    await this.connection.collection('applications').deleteMany({});
  }
}

