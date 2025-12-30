import { AcceptOfferCommandHandler } from './accept-offer.command-handler';
import { AddNotificationsToApplicationCommandHandler } from './add-notifications-to-application.command-handler';
import { CancelOfferCommandHandler } from './cancel-offer.command-handler';
import { CompleteApplicationCommandHandler } from './complete-application.command-handler';
import { CreateApplicationCommandHandler } from './create-application.command-handler';
import { CreateDraftApplicationCommandHandler } from './create-draft-application.command-handler';
import { CreateOfferCommandHandler } from './create-offer.command-handler';
import { DeleteApplicationByIdCommandHandler } from './delete-application-by-id.command-handler';
import { DeleteDraftByIdCommandHandler } from './delete-draft-by-id.command-handler';
import { PublishDraftApplicationCommandHandler } from './publish-draft-application.command-handler';
import { RejectApplicationCommandHandler } from './reject-application.command-handler';
import { RejectBankNotificationCommandHandler } from './reject-bank-notification.command-handler';
import { RejectBankNotificationViaWebhookCommandHandler } from './reject-bank-notification-via-webhook.command-handler';
import { RestoreBankNotificationCommandHandler } from './restore-bank-notification.command-handler';
import { SendPendingNotificationsCommandHandler } from './send-pending-notifications.command-handler';
import { SetApplicationPositionCommandHandler } from './set-application-position.command-handler';
import { TransferApplicationCommandHandler } from './transfer-application.command-handler';
import { TransferDraftCommandHandler } from './transfer-draft.command-handler';
import { UpdateDraftApplicationCommandHandler } from './update-draft-application.command-handler';
import { UpdateOfferCommandHandler } from './update-offer.command-handler';
import { UpdateSubstatusCommandHandler } from './update-substatus.command-handler';

export const ApplicationCommandHandlers = [
  AcceptOfferCommandHandler,
  AddNotificationsToApplicationCommandHandler,
  CancelOfferCommandHandler,
  CompleteApplicationCommandHandler,
  CreateApplicationCommandHandler,
  CreateDraftApplicationCommandHandler,
  CreateOfferCommandHandler,
  DeleteApplicationByIdCommandHandler,
  DeleteDraftByIdCommandHandler,
  PublishDraftApplicationCommandHandler,
  RejectApplicationCommandHandler,
  RejectBankNotificationCommandHandler,
  RejectBankNotificationViaWebhookCommandHandler,
  RestoreBankNotificationCommandHandler,
  SendPendingNotificationsCommandHandler,
  TransferApplicationCommandHandler,
  TransferDraftCommandHandler,
  UpdateDraftApplicationCommandHandler,
  UpdateOfferCommandHandler,
  SetApplicationPositionCommandHandler,
  UpdateSubstatusCommandHandler,
];
