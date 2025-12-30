import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class PublishCommissionCommand {
  private constructor(public readonly id: Id) {}

  public static create(id: OptionalValue<string>): Result<PublishCommissionCommand> {
    return Id.create(
      id,
      () => DomainErrorCode.COMMISSION_ID_EMPTY,
      () => DomainErrorCode.COMMISSION_ID_INVALID,
    ).map((id) => new PublishCommissionCommand(id));
  }
}
