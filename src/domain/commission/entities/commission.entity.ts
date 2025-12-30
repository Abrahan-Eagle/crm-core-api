import { Result, Undefinable } from '@internal/common';

import { Id } from '@/domain/common';

import { CommissionDetail } from './commission-detail.entity';

export enum COMMISSION_STATUS {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class Commission {
  constructor(
    public readonly id: Id,
    public readonly applicationId: Id,
    public readonly companyId: Id,
    public readonly bankId: Id,
    private _status: COMMISSION_STATUS,
    private _commission: CommissionDetail,
    private _psf: CommissionDetail,
    public readonly createdAt: Date,
    private _updatedAt?: Date,
    public readonly version?: number,
  ) {}

  get status(): COMMISSION_STATUS {
    return this._status;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get commission(): CommissionDetail {
    return this._commission;
  }

  get psf(): CommissionDetail {
    return this._psf;
  }

  static create(applicationId: Id, companyId: Id, bankId: Id, commission: number): Result<Commission> {
    return Result.combine([CommissionDetail.create(commission, true), CommissionDetail.create(0, false)]).map(
      ([commission, psf]) =>
        new Commission(
          Id.empty(),
          applicationId,
          companyId,
          bankId,
          COMMISSION_STATUS.DRAFT,
          commission,
          psf,
          new Date(),
        ),
    );
  }

  public publish(): Result<void> {
    return Result.ok().onSuccess(() => {
      this._updatedAt = new Date();
      this._status = COMMISSION_STATUS.PUBLISHED;
    });
  }
}
