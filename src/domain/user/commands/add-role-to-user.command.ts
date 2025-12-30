import { BadRequest, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { User } from '../entities';

export class AddRoleToUserCommand {
  private constructor(
    public readonly id: Id,
    public readonly role: string,
  ) {}

  static create(id: OptionalValue<string>, role: OptionalValue<string>): Result<AddRoleToUserCommand> {
    return Result.combine([
      Id.create(
        id,
        () => new BadRequest(DomainErrorCode.USER_ID_EMPTY),
        () => new BadRequest(DomainErrorCode.USER_ID_INVALID),
      ),
      User.validateRole(role),
    ]).map(([id, role]) => new AddRoleToUserCommand(id, role));
  }
}
