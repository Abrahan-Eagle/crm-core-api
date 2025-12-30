import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Application } from '@/domain/application';
import { Id } from '@/domain/common';

import { ApplicationDocument } from '../documents';
import { ApplicationFileMapper } from './application-file.mapper';
import { ApplicationReferralMapper } from './application-referral.mapper';
import { BankNotificationMapper } from './bank-notification.mapper';
import { FilledApplicationFileMapper } from './filled-application-file.mapper';

@Injectable()
export class ApplicationMapper extends AbstractMapper<ApplicationDocument, Application> {
  constructor(
    private readonly notificationMapper: BankNotificationMapper,
    private readonly fileMapper: ApplicationFileMapper,
    private readonly filledApplicationFile: FilledApplicationFileMapper,
    private readonly referralMapper: ApplicationReferralMapper,
  ) {
    super();
  }

  map(from: ApplicationDocument): Application {
    const filledApplications = this.filledApplicationFile.mapFromList(from.filled_applications);

    const notifications = this.notificationMapper.mapFromList(from.notifications);
    const bankStatements = this.fileMapper.mapFromList(from.bank_statements);
    const mtdStatements = this.fileMapper.mapFromList(from.mtd_statements);
    const creditCardStatements = this.fileMapper.mapFromList(from.credit_card_statements);
    const additionalStatements = this.fileMapper.mapFromList(from.additional_statements);
    const referral = from.referral ? this.referralMapper.map(from.referral) : null;

    const ApplicationInstance = class extends Application {
      static load(): Application {
        return new Application(
          Id.load(from._id.toString()),
          from.status,
          from?.substatus ?? null,
          Id.load(from.company_id.toString()),
          from.track_id,
          from.period,
          from.loan_amount,
          from.product,
          referral,
          filledApplications,
          bankStatements,
          mtdStatements,
          creditCardStatements,
          additionalStatements,
          notifications,
          from.reject_reason,
          from.reject_reason_description,
          from.created_by ? Id.load(from.created_by.toString()) : null,
          from.signature_url,
          from.created_at,
          from.updated_at,
          from.position,
          from.version,
        );
      }
    };
    return ApplicationInstance.load();
  }

  reverseMap(from: Application): ApplicationDocument {
    const doc = new ApplicationDocument();

    doc._id = new Types.ObjectId(from.id.toString());
    doc.status = from.status;
    doc.substatus = from?.substatus ?? null;
    doc.track_id = from.trackingId;
    doc.company_id = new Types.ObjectId(from.companyId.toString());
    doc.period = from.period;
    doc.loan_amount = from.loanAmount;
    doc.product = from.product;
    doc.referral = from.referral ? this.referralMapper.reverseMap(from.referral) : null;

    doc.notifications = this.notificationMapper.reverseMapFromList(from.notifications);

    doc.reject_reason = from.rejectReason;
    doc.reject_reason_description = from.rejectReasonDescription;

    doc.filled_applications = this.filledApplicationFile.reverseMapFromList(from.filledApplications);
    doc.bank_statements = this.fileMapper.reverseMapFromList(from.bankStatements);

    doc.mtd_statements = this.fileMapper.reverseMapFromList(from.mtdStatements);

    doc.credit_card_statements = this.fileMapper.reverseMapFromList(from.creditCardStatements);
    doc.additional_statements = this.fileMapper.reverseMapFromList(from.additionalStatements);
    doc.signature_url = from.signatureUrl;
    doc.created_at = from.createdAt;

    if (from.createdBy) {
      doc.created_by = new Types.ObjectId(from.createdBy.toString());
    }

    doc.updated_at = from.updatedAt;
    doc.position = from.position;
    doc.version = from.version ?? 0;

    return doc;
  }
}
