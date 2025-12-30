import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetProspectByIdQuery {
  private constructor(
    public readonly leadId: Id,
    public readonly prospectId: Id,
  ) {}

  static create(leadId: OptionalValue<string>, prospectId: OptionalValue<string>): Result<GetProspectByIdQuery> {
    return Result.combine([
      Id.create(
        leadId,
        () => DomainErrorCode.LEAD_ID_EMPTY,
        () => DomainErrorCode.LEAD_ID_INVALID,
      ),
      Id.create(
        prospectId,
        () => DomainErrorCode.PROSPECT_ID_EMPTY,
        () => DomainErrorCode.PROSPECT_ID_INVALID,
      ),
    ]).map(([lead, prospect]) => new GetProspectByIdQuery(lead, prospect));
  }
}
