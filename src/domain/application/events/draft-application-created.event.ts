export class DraftApplicationCreatedEvent {
  constructor(
    public readonly prospectId: number,
    public readonly audience: string,
  ) {}
}
