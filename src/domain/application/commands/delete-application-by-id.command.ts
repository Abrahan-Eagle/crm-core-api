import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class DeleteApplicationByIdCommand {
  private constructor(public readonly applicationId: Id) {}

  static create(applicationId: OptionalValue<string>): Result<DeleteApplicationByIdCommand> {
    return Id.create(
      applicationId,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    ).map((id) => new DeleteApplicationByIdCommand(id));
  }
}
