import { BadRequest, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class EnableUserCommand {
  private constructor(public readonly id: Id) {}

  static create(id: OptionalValue<string>): Result<EnableUserCommand> {
    return Id.create(
      id,
      () => new BadRequest(DomainErrorCode.USER_ID_EMPTY),
      () => new BadRequest(DomainErrorCode.USER_ID_INVALID),
    ).map((id) => new EnableUserCommand(id));
  }
}
