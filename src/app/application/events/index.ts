import { ApplicationAcceptedEventHandler } from './application-accepted.event-handler';
import { DraftApplicationCreatedEventHandler } from './draft-created.event-handler';
import { ProspectCreatedEventHandler } from './prospect-created.event-handler';

export const ApplicationEventsHandlers = [
  ApplicationAcceptedEventHandler,
  DraftApplicationCreatedEventHandler,
  ProspectCreatedEventHandler,
];
