import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { CallRequest } from '../entities';

export class MakeACallCommand {
  private constructor(public readonly request: CallRequest) {}

  public static create(
    userId: OptionalValue<string>,
    entityType: OptionalValue<string>,
    entityId: OptionalValue<string>,
    phoneIndex: OptionalValue<number>,
  ): Result<MakeACallCommand> {
    return Result.combine([
      Id.create(
        userId,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ),
      Id.create(
        entityId,
        () => DomainErrorCode.CALL_ENTITY_ID_EMPTY,
        () => DomainErrorCode.CALL_ENTITY_INVALID,
      ),
    ])
      .flatMap(([user, entity]) => CallRequest.create(user, entity, entityType, phoneIndex))
      .map((request) => new MakeACallCommand(request));
  }
}
