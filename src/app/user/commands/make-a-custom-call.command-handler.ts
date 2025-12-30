import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, mergeMap, Observable } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { MakeACustomCallCommand, User, UserRepository, VoIPProviderRepository } from '@/domain/user';

@CommandHandler(MakeACustomCallCommand)
export class MakeACustomCallCommandHandler extends BaseCommandHandler<MakeACustomCallCommand, void> {
  constructor(
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionConstant.VOIP_PROVIDER_REPOSITORY)
    private readonly voIPProvider: VoIPProviderRepository,
  ) {
    super();
  }

  handle(command: MakeACustomCallCommand): Observable<void> {
    const { userId, phone } = command;
    return this.userRepository.findById(userId).pipe(
      throwIfVoid<User>(() => NotFound.of(User, userId.toString())),
      delayWhen<User>((user) =>
        this.voIPProvider.getAgentIdFromEmail(user.email).pipe(
          throwIfVoid(() => NotFound.of(User, user.email.toString())),
          mergeMap((agentId) => this.voIPProvider.makeACall(phone, agentId)),
        ),
      ),
      mapToVoid(),
    );
  }
}
