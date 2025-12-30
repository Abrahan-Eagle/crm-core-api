import { Nullable } from '@internal/common';

export class ProspectCreatedEvent {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly lookingFor: number,
    public readonly phone: string,
    public readonly email: string,
    public readonly source: Nullable<string>,
    public readonly reference: Nullable<string>,
  ) {}
}
