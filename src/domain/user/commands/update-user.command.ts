import { Nullable, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { User } from '../entities';

export class UpdateUserCommand {
  private constructor(
    public readonly userId: Id,
    public readonly firstName: Nullable<string>,
    public readonly lastName: Nullable<string>,
    public readonly tenants: Nullable<string[]>,
  ) {}

  public static create(
    id: OptionalValue<string>,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    tenants: OptionalValue<string[]>,
  ): Result<UpdateUserCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ) as Result<Id>,
      firstName !== undefined ? User.validateFirstName(firstName) : Result.ok(null),
      lastName !== undefined ? User.validateLastName(lastName) : Result.ok(null),
      tenants !== undefined ? User.validateTenants(tenants) : Result.ok(null),
    ]).map((params) => new UpdateUserCommand(...params));
  }
}
