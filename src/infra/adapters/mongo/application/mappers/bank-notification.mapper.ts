import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { BankNotification } from '@/domain/application';
import { Id } from '@/domain/common';

import { BankNotificationDocument } from '../documents';
import { OfferMapper } from './offer.mapper';

@Injectable()
export class BankNotificationMapper extends AbstractMapper<BankNotificationDocument, BankNotification> {
  constructor(private readonly bankOffersMapper: OfferMapper) {
    super();
  }

  map(from: BankNotificationDocument): BankNotification {
    const offers = this.bankOffersMapper.mapFromList(from.offers);

    const BankNotificationInstance = class extends BankNotification {
      static load(): BankNotification {
        return new BankNotification(
          Id.load(from._id.toString()),
          Id.load(from.bank_id.toString()),
          from.status,
          from.reject_reason,
          from.reject_reason_description,
          offers,
          from.created_at,
          from.updated_at,
        );
      }
    };
    return BankNotificationInstance.load();
  }

  reverseMap(from: BankNotification): BankNotificationDocument {
    const doc = new BankNotificationDocument();

    if (!from.id.isEmpty()) {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.status = from.status;
    doc.bank_id = new Types.ObjectId(from.bankId.toString());
    doc.reject_reason = from.rejectReason;
    doc.reject_reason_description = from.rejectReasonDescription;
    doc.offers = this.bankOffersMapper.reverseMapFromList(from.offers);
    doc.created_at = from.createdAt;
    doc.updated_at = from.updatedAt;

    return doc;
  }
}
