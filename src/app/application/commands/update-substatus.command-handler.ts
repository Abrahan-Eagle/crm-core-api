import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, APPLICATION_STATUS, ApplicationRepository, UpdateSubstatusCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';

@CommandHandler(UpdateSubstatusCommand)
export class UpdateSubstatusCommandHandler extends BaseCommandHandler<UpdateSubstatusCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly repository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: UpdateSubstatusCommand): Observable<void> {
    const { applicationId, substatus } = command;
    return this.repository.findById(applicationId).pipe(
      throwIfVoid(() => NotFound.of(Application, applicationId.toString())),
      validateIf(
        (application) => ![APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(application.status),
        (application) => new ApplicationBlocked(application.status),
      ),
      tap((application: Application) => application.updateSubstatus(substatus).getOrThrow()),
      mergeMap((bank) => this.repository.updateOne(bank)),
      mapToVoid(),
    );
  }
}
