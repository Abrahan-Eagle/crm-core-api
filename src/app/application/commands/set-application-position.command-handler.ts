import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, SetApplicationPositionCommand } from '@/domain/application';

@CommandHandler(SetApplicationPositionCommand)
export class SetApplicationPositionCommandHandler extends BaseCommandHandler<SetApplicationPositionCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly repository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: SetApplicationPositionCommand): Observable<void> {
    const { applicationId, position } = command;
    return this.repository.findById(applicationId).pipe(
      throwIfVoid(() => NotFound.of(Application, applicationId.toString())),
      tap((application: Application) => application.setPosition(position).getOrThrow()),
      mergeMap((application) => this.repository.updateOne(application)),
    );
  }
}
