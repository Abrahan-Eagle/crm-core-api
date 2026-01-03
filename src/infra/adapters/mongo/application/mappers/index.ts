import { ApplicationMapper } from './application.mapper';
import { ApplicationFileMapper } from './application-file.mapper';
import { ApplicationReferralMapper } from './application-referral.mapper';
import { BankNotificationMapper } from './bank-notification.mapper';
import { DraftApplicationMapper } from './draft-application.mapper';
import { DraftApplicationFileMapper } from './draft-application-file.mapper';
import { FilledApplicationFileMapper } from './filled-application-file.mapper';
import { OfferMapper } from './offer.mapper';

export * from './application.mapper';
export * from './application-file.mapper';
export * from './application-referral.mapper';
export * from './bank-notification.mapper';
export * from './draft-application.mapper';
export * from './draft-application-file.mapper';
export * from './filled-application-file.mapper';
export * from './offer.mapper';

export const ApplicationMappers = [
  ApplicationMapper,
  ApplicationFileMapper,
  ApplicationReferralMapper,
  BankNotificationMapper,
  DraftApplicationMapper,
  DraftApplicationFileMapper,
  FilledApplicationFileMapper,
  OfferMapper,
];
