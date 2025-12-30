import { BaseCommandHandler, CommandHandler, NotFound, Result, throwIfVoid, Validator } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import {
  DraftApplication,
  DraftApplicationDocument,
  DraftApplicationRepository,
  UpdateDraftApplicationCommand,
} from '@/domain/application';

@CommandHandler(UpdateDraftApplicationCommand)
export class UpdateDraftApplicationCommandHandler extends BaseCommandHandler<UpdateDraftApplicationCommand, void> {
  constructor(
    @Inject(InjectionConstant.DRAFT_APPLICATION_REPOSITORY)
    private readonly repository: DraftApplicationRepository,
  ) {
    super();
  }

  handle(command: UpdateDraftApplicationCommand) {
    const { applicationId, statements } = command;
    return this.repository.findById(applicationId).pipe(
      throwIfVoid(() => NotFound.of(DraftApplication, applicationId.toString())),
      tap((application) => {
        Result.combine(
          statements.map((statement) =>
            Validator.of(application.bankStatements.find((bankStatement) => bankStatement.period === statement.period))
              .required(() => NotFound.of(DraftApplicationDocument, ''))
              .flatMap((document) => document.update(statement)),
          ),
        ).getOrThrow();
      }),
      mergeMap((bank) => this.repository.updateOne(bank)),
    );
  }
}
