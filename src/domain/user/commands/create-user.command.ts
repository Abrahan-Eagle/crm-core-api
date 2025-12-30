import { BadRequest, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { User } from '../entities';

export class CreateUserCommand {
  private constructor(
    public readonly user: User,
    public readonly password: string,
  ) {}

  static create(
    id: OptionalValue<string>,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    email: OptionalValue<string>,
    password: OptionalValue<string>,
    roles: OptionalValue<string[]>,
    tenants: OptionalValue<string[]>,
  ): Result<CreateUserCommand> {
    return Result.combine([
      Id.create(
        id,
        () => new BadRequest(DomainErrorCode.USER_ID_EMPTY),
        () => new BadRequest(DomainErrorCode.USER_ID_INVALID),
      ).flatMap((id) => User.create(id, firstName, lastName, email, roles, tenants)),
      User.validatePassword(password),
    ]).map(([user, password]) => new CreateUserCommand(user, password));
  }
}
