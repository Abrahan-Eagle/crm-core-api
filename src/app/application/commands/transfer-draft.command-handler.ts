import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { forkJoin, mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { DraftApplication, DraftApplicationRepository, TransferDraftCommand } from '@/domain/application';
import { Id } from '@/domain/common';
import { User, UserRepository } from '@/domain/user';

@CommandHandler(TransferDraftCommand)
export class TransferDraftCommandHandler extends BaseCommandHandler<TransferDraftCommand, void> {
  constructor(
    @Inject(InjectionConstant.DRAFT_APPLICATION_REPOSITORY)
    private readonly draftRepository: DraftApplicationRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  handle(command: TransferDraftCommand): Observable<void> {
    const { draftId, userId } = command;
    return forkJoin({
      draft: this._getDraftApp(draftId),
      user: this._getUser(userId),
    }).pipe(
      tap(({ draft, user }) => draft.transfer(user.id).getOrThrow()),
      mergeMap(({ draft }) => this.draftRepository.updateOne(draft)),
    );
  }

  private _getDraftApp(draftId: Id): Observable<DraftApplication> {
    return this.draftRepository
      .findById(draftId)
      .pipe(throwIfVoid<DraftApplication>(() => NotFound.of(DraftApplication, draftId.toString())));
  }

  private _getUser(userId: Id): Observable<User> {
    return this.userRepository.findById(userId).pipe(
      throwIfVoid<User>(() => NotFound.of(User, userId.toString())),
      validateIf(
        (user) => user.isActive(),
        () => NotFound.of(User, userId.toString()),
      ),
    );
  }
}
