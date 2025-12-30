import { Nullable, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Application, REJECT_REASONS } from '../entities';

export class RejectApplicationCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly reason: REJECT_REASONS,
    public readonly other: Nullable<string>,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    reason: OptionalValue<string>,
    other: OptionalValue<string>,
  ): Result<RejectApplicationCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Application.validateRejectReason(reason),
      Application.validateRejectDescription(reason, other),
    ]).map((params) => new RejectApplicationCommand(...params));
  }
}
