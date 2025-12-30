import { Nullable } from '@internal/common';

export class NotificationRequestedEvent {
  constructor(
    public readonly userId: string,
    public readonly description: string,
    public readonly redirectUrl?: Nullable<string>,
  ) {}
}
