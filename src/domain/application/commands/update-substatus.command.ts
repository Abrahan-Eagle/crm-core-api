import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Application, APPLICATION_SUBSTATUS } from '../entities';

export class UpdateSubstatusCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly substatus: APPLICATION_SUBSTATUS,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    substatus: OptionalValue<string>,
  ): Result<UpdateSubstatusCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Application.validateSubstatus(substatus),
    ]).map((params) => new UpdateSubstatusCommand(...params));
  }
}
