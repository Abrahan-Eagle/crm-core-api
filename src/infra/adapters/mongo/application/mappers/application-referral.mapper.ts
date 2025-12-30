import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { ApplicationReferral } from '@/domain/application';

import { ApplicationReferralDocument } from '../documents';

@Injectable()
export class ApplicationReferralMapper extends AbstractMapper<ApplicationReferralDocument, ApplicationReferral> {
  map(from: ApplicationReferralDocument): ApplicationReferral {
    const ApplicationReferralInstance = class extends ApplicationReferral {
      static load(): ApplicationReferral {
        return new ApplicationReferral(from.source, from.reference);
      }
    };
    return ApplicationReferralInstance.load();
  }

  reverseMap(from: ApplicationReferral): ApplicationReferralDocument {
    const doc = new ApplicationReferralDocument();

    doc.source = from.source;
    doc.reference = from.reference;

    return doc;
  }
}
