import { Nullable, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Application } from '../entities';

export class SetApplicationPositionCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly position: Nullable<number>,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    position: OptionalValue<number>,
  ): Result<SetApplicationPositionCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Application.validatePosition(position),
    ]).map(([id, position]: [Id, Nullable<number>]) => new SetApplicationPositionCommand(id, position));
  }
}
