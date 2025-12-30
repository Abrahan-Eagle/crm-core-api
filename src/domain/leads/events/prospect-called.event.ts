export class ProspectCalledEvent {
  constructor(
    public readonly userId: string,
    public readonly prospectId: string,
    public readonly date: Date,
  ) {}
}
