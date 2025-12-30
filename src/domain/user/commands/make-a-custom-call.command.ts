import { OptionalValue, Phone, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class MakeACustomCallCommand {
  private constructor(
    public readonly userId: Id,
    public readonly phone: Phone,
  ) {}

  public static create(
    userId: OptionalValue<string>,
    intlPrefix: OptionalValue<string>,
    regionCode: OptionalValue<string>,
    number: OptionalValue<string>,
  ): Result<MakeACustomCallCommand> {
    return Result.combine([
      Id.create(
        userId,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ),
      Phone.create(intlPrefix, regionCode, number),
    ]).map(([id, phone]) => new MakeACustomCallCommand(id, phone));
  }
}
