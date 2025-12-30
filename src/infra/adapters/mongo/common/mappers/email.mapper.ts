import { AbstractMapper, Email } from '@internal/common';

import { EmailDocument } from '../documents';

export class EmailMapper extends AbstractMapper<EmailDocument, Email> {
  map(from: EmailDocument): Email {
    const EmailInstance = class extends Email {
      static load(): Email {
        return new Email(from.value, from.verified, from.verified_at);
      }
    };
    return EmailInstance.load();
  }

  reverseMap(from: Email): EmailDocument {
    const doc = new EmailDocument();

    doc.value = from.value;
    doc.verified = from.verified;
    doc.verified_at = from.verifiedAt;

    return doc;
  }
}
