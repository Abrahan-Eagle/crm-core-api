import {
  BadRequest,
  BaseCommandHandler,
  CommandHandler,
  Id,
  mapToVoid,
  NotFound,
  Result,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Commission, COMMISSION_STATUS, CommissionRepository } from '@/domain/commission';
import { UpdateCommissionCommand } from '@/domain/commission/commands';
import { DomainErrorCode } from '@/domain/common';
import { User, UserRepository } from '@/domain/user';

@CommandHandler(UpdateCommissionCommand)
export class UpdateCommissionCommandHandler extends BaseCommandHandler<UpdateCommissionCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {
    super();
  }

  handle(command: UpdateCommissionCommand): Observable<void> {
    const { commissionId, psfTotal, commissionDistribution, psfDistribution } = command;
    return this.repository.findById(commissionId).pipe(
      throwIfVoid(() => NotFound.of(Commission, commissionId.toString())),
      validateIf(
        (commission) => commission.status === COMMISSION_STATUS.DRAFT,
        () => new BadRequest(DomainErrorCode.COMMISSION_IS_PUBLISHED),
      ),
      delayWhen(() =>
        this._validateUsers([
          ...commissionDistribution.map((item) => item.userId),
          ...psfDistribution.map((item) => item.userId),
        ]),
      ),
      tap<Commission>((commission) =>
        Result.combine([
          commission.psf.update(psfTotal, psfDistribution),
          commission.commission.update(commission.commission.total, commissionDistribution),
        ]).getOrThrow(),
      ),
      mergeMap((commission) => this.repository.updateOne(commission)),
      mapToVoid(),
    );
  }

  private _validateUsers(ids: Id[]): Observable<void> {
    return this.users.findMany(ids).pipe(
      validateIf(
        (users) => [...new Set(ids.map((id) => id.toString()))].length === users.length,
        () => NotFound.of(User, ''),
      ),
      mapToVoid(),
    );
  }
}
