import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { UpdateMyProfileCommand, User, UserRepository } from '@/domain/user';

@CommandHandler(UpdateMyProfileCommand)
export class UpdateMyProfileCommandHandler extends BaseCommandHandler<UpdateMyProfileCommand, void> {
  constructor(
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly repository: UserRepository,
  ) {
    super();
  }

  handle(command: UpdateMyProfileCommand): Observable<void> {
    return this.repository.findById(command.userId).pipe(
      throwIfVoid(() => NotFound.of(User, command.userId.toString())),
      tap<User>((user: User) => user.updateUser({ ...command })),

      delayWhen<User>((user) => this.repository.updateOne(user)),
      mapToVoid(),
    );
  }
}
