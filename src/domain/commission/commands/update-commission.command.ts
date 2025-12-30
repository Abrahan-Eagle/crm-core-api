import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Distribution } from '../entities';

type UpdateCommissionDetails = {
  total?: OptionalValue<number>;
  distribution?: OptionalValue<UpdateDistribution[]>;
};

type UpdateDistribution = {
  userId: OptionalValue<string>;
  amount: OptionalValue<number>;
};

export class UpdateCommissionCommand {
  private constructor(
    public readonly commissionId: Id,
    public readonly commissionDistribution: Distribution[],
    public readonly psfTotal: number,
    public readonly psfDistribution: Distribution[],
  ) {}

  public static create(
    id: OptionalValue<string>,
    commission: OptionalValue<UpdateCommissionDetails>,
    psf: OptionalValue<UpdateCommissionDetails>,
  ): Result<UpdateCommissionCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.COMMISSION_ID_EMPTY,
        () => DomainErrorCode.COMMISSION_ID_INVALID,
      ) as Result<Id>,
      Validator.of(commission?.distribution)
        .required(() => DomainErrorCode.DISTRIBUTION_INVALID)
        .array(() => DomainErrorCode.DISTRIBUTION_INVALID)
        .flatMap((items) =>
          Result.combine(
            items.map((item) =>
              Distribution.create(
                Id.create(
                  item.userId,
                  () => DomainErrorCode.USER_ID_EMPTY,
                  () => DomainErrorCode.USER_ID_INVALID,
                ).getOrThrow(),
                item?.amount,
              ),
            ),
          ),
        ),
      Distribution.validateAmount(psf?.total),
      Validator.of(psf?.distribution)
        .required(() => DomainErrorCode.DISTRIBUTION_INVALID)
        .array(() => DomainErrorCode.DISTRIBUTION_INVALID)
        .flatMap((items) =>
          Result.combine(
            items.map((item) =>
              Distribution.create(
                Id.create(
                  item.userId,
                  () => DomainErrorCode.USER_ID_EMPTY,
                  () => DomainErrorCode.USER_ID_INVALID,
                ).getOrThrow(),
                item?.amount,
              ),
            ),
          ),
        ),
    ]).map((params) => new UpdateCommissionCommand(...params));
  }
}
