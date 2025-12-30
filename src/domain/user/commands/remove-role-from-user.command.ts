import { BadRequest, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { User } from '../entities';

export class RemoveRoleFromUserCommand {
  private constructor(
    public readonly id: Id,
    public readonly role: string,
  ) {}

  static create(id: OptionalValue<string>, role: OptionalValue<string>): Result<RemoveRoleFromUserCommand> {
    return Result.combine([
      Id.create(
        id,
        () => new BadRequest(DomainErrorCode.USER_ID_EMPTY),
        () => new BadRequest(DomainErrorCode.USER_ID_INVALID),
      ),
      User.validateRole(role),
    ]).map(([id, role]) => new RemoveRoleFromUserCommand(id, role));
  }
}
