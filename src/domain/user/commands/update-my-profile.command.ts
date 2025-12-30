import { Nullable, OptionalValue, Phone, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { User } from '../entities';

type UpdatePhoneRequest = {
  intlPrefix?: OptionalValue<string>;
  regionCode?: OptionalValue<string>;
  number?: OptionalValue<string>;
};

export class UpdateMyProfileCommand {
  private constructor(
    public readonly userId: Id,
    public readonly firstName: Nullable<string>,
    public readonly lastName: Nullable<string>,
    public readonly phone: Nullable<Phone>,
  ) {}

  public static create(
    id: OptionalValue<string>,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    phone?: OptionalValue<UpdatePhoneRequest>,
  ): Result<UpdateMyProfileCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ) as Result<Id>,
      firstName !== undefined ? User.validateFirstName(firstName) : Result.ok(null),
      lastName !== undefined ? User.validateLastName(lastName) : Result.ok(null),
      phone !== undefined ? Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number) : Result.ok(null),
    ]).map((params) => new UpdateMyProfileCommand(...params));
  }
}
