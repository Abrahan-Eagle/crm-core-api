import { Id } from '@/domain/common';

export class ApplicationAcceptedEvent {
  constructor(
    public readonly applicationId: Id,
    public readonly companyId: Id,
    public readonly bankId: Id,
    public readonly commission: number,
  ) {}
}
