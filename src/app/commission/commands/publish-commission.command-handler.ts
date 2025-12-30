import {
  BadRequest,
  BaseCommandHandler,
  CommandHandler,
  mapToVoid,
  NotFound,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Commission, COMMISSION_STATUS, CommissionRepository } from '@/domain/commission';
import { PublishCommissionCommand } from '@/domain/commission/commands';
import { DomainErrorCode } from '@/domain/common';

@CommandHandler(PublishCommissionCommand)
export class PublishCommissionCommandHandler extends BaseCommandHandler<PublishCommissionCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepository,
  ) {
    super();
  }

  handle(command: PublishCommissionCommand): Observable<void> {
    return this.repository.findById(command.id).pipe(
      throwIfVoid(() => NotFound.of(Commission, command.id.toString())),
      validateIf(
        (commission) => commission.status === COMMISSION_STATUS.DRAFT,
        () => new BadRequest(DomainErrorCode.COMMISSION_IS_PUBLISHED),
      ),
      tap<Commission>((commission) => commission.publish().getOrThrow()),
      mergeMap((commission) => this.repository.updateOne(commission)),
      mapToVoid(),
    );
  }
}
