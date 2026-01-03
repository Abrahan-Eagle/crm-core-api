/**
 * Application Testing Seeder
 * 
 * Creates applications with notifications and offers to test the cancelOffer fix.
 * This seeder bypasses validation by using the constructor directly.
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

import {
  Application,
  ApplicationRepository,
  APPLICATION_STATUS,
  BankNotification,
  NOTIFICATION_STATUS,
  Offer,
  OFFER_STATUS,
  OFFER_PAYMENT_PLAN,
  ApplicationDocument,
  StatementDocumentType,
} from '@/domain/application';
import { CompanyRepository } from '@/domain/company';
import { BankRepository } from '@/domain/bank';
import { Id, DomainErrorCode, PRODUCT_TYPE, getPeriodFromDate, getPreviousPeriods } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class ApplicationTestingSeeder extends BaseSeeder {
  private companyIds: Id[] = [];
  private userIds: Id[] = [];
  private bankIds: Id[] = [];

  constructor(
    connection: Connection,
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🧪 Seeding Applications for Testing (cancelOffer fix)...');

    // Get existing companies, users, and banks
    const companies = await this.connection.collection('companies').find({}).limit(10).toArray();
    this.companyIds = companies.map((c) =>
      Id.create(c._id.toString(), () => DomainErrorCode.COMPANY_ID_EMPTY, () => DomainErrorCode.COMPANY_ID_INVALID).getOrThrow(),
    );

    const users = await this.connection.collection('users').find({}).limit(10).toArray();
    this.userIds = users.map((u) =>
      Id.create(u._id.toString(), () => DomainErrorCode.USER_ID_EMPTY, () => DomainErrorCode.USER_ID_INVALID).getOrThrow(),
    );

    const banks = await this.connection.collection('banks').find({}).limit(10).toArray();
    this.bankIds = banks.map((b) =>
      Id.create(b._id.toString(), () => DomainErrorCode.BANK_ID_EMPTY, () => DomainErrorCode.BANK_ID_INVALID).getOrThrow(),
    );

    if (this.companyIds.length === 0 || this.bankIds.length === 0 || this.userIds.length === 0) {
      console.log('⚠️  Need companies, banks, and users. Please run seeders first.');
      return;
    }

    const applications: Application[] = [];

    // Test Case 1: Application with one notification, one accepted offer (will be canceled)
    const app1 = this.createApplicationWithOffers(
      APPLICATION_STATUS.OFFERED,
      [
        {
          status: NOTIFICATION_STATUS.OFFERED,
          offers: [{ status: OFFER_STATUS.ACCEPTED }], // This offer will be canceled
        },
        {
          status: NOTIFICATION_STATUS.REPLIED,
          offers: [], // No offers, just replied
        },
      ],
    );
    if (app1) applications.push(app1);

    // Test Case 2: Application with multiple notifications, multiple offers
    const app2 = this.createApplicationWithOffers(
      APPLICATION_STATUS.OFFERED,
      [
        {
          status: NOTIFICATION_STATUS.OFFERED,
          offers: [
            { status: OFFER_STATUS.ACCEPTED }, // Will be canceled
            { status: OFFER_STATUS.ACCEPTED }, // Other offer remains
          ],
        },
        {
          status: NOTIFICATION_STATUS.OFFERED,
          offers: [{ status: OFFER_STATUS.ACCEPTED }], // Another offer
        },
      ],
    );
    if (app2) applications.push(app2);

    // Test Case 3: Application with accepted notification (should remain OFFER_ACCEPTED)
    const app3 = this.createApplicationWithOffers(
      APPLICATION_STATUS.OFFER_ACCEPTED,
      [
        {
          status: NOTIFICATION_STATUS.ACCEPTED,
          offers: [{ status: OFFER_STATUS.ACCEPTED }], // Accepted offer
        },
        {
          status: NOTIFICATION_STATUS.OFFERED,
          offers: [{ status: OFFER_STATUS.ACCEPTED }], // This will be canceled
        },
      ],
    );
    if (app3) applications.push(app3);

    // Test Case 4: Application with only rejected notifications (should go to SENT)
    const app4 = this.createApplicationWithOffers(
      APPLICATION_STATUS.OFFERED,
      [
        {
          status: NOTIFICATION_STATUS.REJECTED,
          offers: [{ status: OFFER_STATUS.ACCEPTED }], // Will be canceled
        },
      ],
    );
    if (app4) applications.push(app4);

    // Save applications using saveForTenants (requires tenant)
    // For testing purposes, we use the first tenant available
    const defaultTenant = 'business_market_finders';
    
    if (applications.length > 0) {
      const appsWithTenants = applications.map((app) => ({
        application: app,
        tenant: defaultTenant,
      }));

      try {
        await firstValueFrom(this.applicationRepository.saveForTenants(appsWithTenants));
        console.log(`✅ Saved ${applications.length} test applications with notifications and offers to database`);
      } catch (error) {
        console.error(`❌ Error saving test applications:`, error);
        console.log(`⚠️  Prepared ${applications.length} test applications (not saved)`);
      }
    } else {
      console.log(`⚠️  No test applications were created`);
    }
  }

  private createApplicationWithOffers(
    appStatus: APPLICATION_STATUS,
    notificationConfigs: Array<{ status: NOTIFICATION_STATUS; offers: Array<{ status: OFFER_STATUS }> }>,
  ): Application | null {
    if (this.companyIds.length === 0 || this.bankIds.length === 0 || this.userIds.length === 0) {
      return null;
    }

    const applicationId = Id.create(
      new Types.ObjectId().toString(),
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    ).getOrThrow();

    const companyId = this.companyIds[faker.datatype.number({ min: 0, max: this.companyIds.length - 1 })];
    const createdBy = this.userIds[faker.datatype.number({ min: 0, max: this.userIds.length - 1 })];
    const period = getPeriodFromDate(new Date());
    const trackingId = crypto.randomBytes(6).toString('hex');
    const loanAmount = faker.datatype.number({ min: 10000, max: 500000 });
    const product = PRODUCT_TYPE.FACTORING;
    const position = faker.datatype.number({ min: 1, max: 5 });

    // Create notifications with offers
    const notifications: BankNotification[] = [];
    for (const config of notificationConfigs) {
      const notificationId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.NOTIFICATION_ID_EMPTY,
        () => DomainErrorCode.NOTIFICATION_ID_INVALID,
      ).getOrThrow();

      const bankId = this.bankIds[faker.datatype.number({ min: 0, max: this.bankIds.length - 1 })];
      const notificationCreatedAt = new Date();

      // Create offers for this notification
      const offers: Offer[] = [];
      for (const offerConfig of config.offers) {
        const offerId = Id.create(
          new Types.ObjectId().toString(),
          () => DomainErrorCode.OFFER_ID_EMPTY,
          () => DomainErrorCode.OFFER_ID_INVALID,
        ).getOrThrow();

        const offerCreatedAt = new Date();
        const offer = new Offer(
          offerId,
          faker.datatype.number({ min: 10000, max: 500000 }), // purchasedAmount
          faker.datatype.number({ min: 1, max: 3 }) / 10, // factorRate (0.1-0.3)
          faker.datatype.number({ min: 1, max: 5 }), // position
          faker.datatype.number({ min: 0, max: 14 }), // points
          OFFER_PAYMENT_PLAN.MONTHLY, // paymentPlan
          faker.datatype.number({ min: 6, max: 24 }), // paymentPlanDuration
          offerConfig.status, // status
          offerCreatedAt,
          offerCreatedAt,
        );
        offers.push(offer);
      }

      const notification = new BankNotification(
        notificationId,
        bankId,
        config.status,
        null, // rejectReason
        null, // rejectReasonDescription
        offers,
        notificationCreatedAt,
        notificationCreatedAt,
      );
      notifications.push(notification);
    }

    // Create minimal bankStatements documents for UI display (using constructor directly - bypasses validation)
    const requiredPeriods = getPreviousPeriods(new Date(), 4);
    const bankStatements: ApplicationDocument[] = requiredPeriods.map((p, index) => {
      return new ApplicationDocument(
        `bank-statement-${index + 1}.pdf`, // name
        faker.datatype.number({ min: 1000, max: 10000 }), // amount
        faker.datatype.number({ min: 10, max: 100 }), // transactions
        faker.datatype.number({ min: 0, max: 5 }), // negativeDays
        p, // period
        null, // file (null - bypassing validation, but allows UI to show application)
      );
    });

    // Create application using constructor directly (bypasses validation)
    const applicationCreatedAt = new Date();
    const application = new Application(
      applicationId,
      appStatus,
      null, // substatus
      companyId,
      trackingId,
      period,
      loanAmount,
      product,
      null, // referral
      [], // filledApplications
      bankStatements, // bankStatements (minimal documents for UI display)
      [], // mtdStatements
      [], // creditCardStatements
      [], // additionalStatements
      notifications,
      null, // rejectReason
      null, // rejectReasonDescription
      createdBy,
      null, // signatureUrl
      applicationCreatedAt,
      applicationCreatedAt,
      position,
    );

    return application;
  }

  async clean(): Promise<void> {
    // Applications with test prefix could be cleaned here if needed
    await this.connection.collection('applications').deleteMany({});
  }
}

