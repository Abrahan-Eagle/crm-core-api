import { BadRequest, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { User } from '../entities';

export class CreateAffiliateCommand {
  private constructor(public readonly user: User) {}

  static create(id: OptionalValue<string>, email: OptionalValue<string>): Result<CreateAffiliateCommand> {
    return Id.create(
      id,
      () => new BadRequest(DomainErrorCode.USER_ID_EMPTY),
      () => new BadRequest(DomainErrorCode.USER_ID_INVALID),
    )
      .flatMap((id) => User.create(id, 'Guest', 'User', email, ['rol_A3tdfj0JvuzJEqQk'], ['business_market_finders']))
      .map((user) => new CreateAffiliateCommand(user));
  }
}
