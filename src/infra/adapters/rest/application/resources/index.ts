import { AcceptOfferResource } from './accept-offer.resource';
import { AddNotificationsToApplicationToBanksResource } from './add-notifications-to-application.resource';
import { CancelOfferResource } from './cancel-offer.resource';
import { CompleteApplicationResource } from './complete-application.resource';
import { CreateApplicationResource } from './create-application.resource';
import { CreateDraftApplicationResource } from './create-draft-application.resource';
import { CreateOfferResource } from './create-offer.resource';
import { DeleteApplicationByIdResource } from './delete-application-by-id.resource';
import { DeleteDraftByIdResource } from './delete-draft-by-id.resource';
import { GetApplicationIdResource } from './get-application-by-id.resource';
import { GetBankNotificationsResource } from './get-bank-notifications.resource';
import { GetDraftByIdResource } from './get-draft-by-id.resource';
import { GetLasApplicationPeriodResource } from './get-last-application-period.resource';
import { GetRecommendedBanksResource } from './get-recommended-banks.resource';
import { PublishDraftApplicationResource } from './publish-draft-application.resource';
import { RejectApplicationResource } from './reject-application.resource';
import { RejectBankNotificationResource } from './reject-bank-notification.resource';
import { RestoreBankNotificationResource } from './restore-bank-notification.resource';
import { SearchApplicationsResource } from './search-applications.resource';
import { SearchDraftApplicationsResource } from './search-draft-applications.resource';
import { SendPendingNotificationsResource } from './send-pending-notifications.resource';
import { SetApplicationPositionResource } from './set-application-position.resource';
import { TransferApplicationResource } from './transfer-application.resource';
import { TransferDraftResource } from './transfer-draft.resource';
import { UpdateDraftApplicationResource } from './update-draft-application.resource';
import { UpdateOfferResource } from './update-offer.resource';
import { UpdateSubstatusResource } from './update-substate.resource';

export * from './webhooks';

export const ApplicationResources = [
  AcceptOfferResource,
  AddNotificationsToApplicationToBanksResource,
  CancelOfferResource,
  CompleteApplicationResource,
  CreateApplicationResource,
  CreateDraftApplicationResource,
  CreateOfferResource,
  DeleteApplicationByIdResource,
  DeleteDraftByIdResource,
  GetApplicationIdResource,
  GetBankNotificationsResource,
  GetDraftByIdResource,
  GetLasApplicationPeriodResource,
  GetRecommendedBanksResource,
  PublishDraftApplicationResource,
  RejectApplicationResource,
  RejectBankNotificationResource,
  RestoreBankNotificationResource,
  SearchApplicationsResource,
  SearchDraftApplicationsResource,
  SendPendingNotificationsResource,
  TransferApplicationResource,
  TransferDraftResource,
  UpdateDraftApplicationResource,
  UpdateOfferResource,
  SetApplicationPositionResource,
  UpdateSubstatusResource,
];
