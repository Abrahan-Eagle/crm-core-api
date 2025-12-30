import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Offer } from '@/domain/application';
import { Id } from '@/domain/common';

import { OfferDocument } from '../documents';

@Injectable()
export class OfferMapper extends AbstractMapper<OfferDocument, Offer> {
  map(from: OfferDocument): Offer {
    const OfferInstance = class extends Offer {
      static load(): Offer {
        return new Offer(
          Id.load(from._id.toString()),
          from.purchased_amount,
          from.factor_rate,
          from.position,
          from.points,
          from.payment_plan,
          from.payment_plan_duration || 0,
          from.status,
          from.created_at,
          from.updated_at,
        );
      }
    };
    return OfferInstance.load();
  }

  reverseMap(from: Offer): OfferDocument {
    const doc = new OfferDocument();

    if (!from.id.isEmpty()) {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.purchased_amount = from.purchasedAmount;
    doc.factor_rate = from.factorRate;
    doc.position = from.position;
    doc.points = from.points;
    doc.payment_plan = from.paymentPlan;
    doc.payment_plan_duration = from?.paymentPlanDuration || 0;
    doc.status = from.status;
    doc.purchased_price = from.purchasedPrice;
    doc.commission = from.commission;

    doc.updated_at = from.updatedAt;
    doc.created_at = from.createdAt;

    return doc;
  }
}
