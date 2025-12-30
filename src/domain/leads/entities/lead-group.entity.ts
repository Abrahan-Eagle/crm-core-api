import { AggregateRoot, BadRequest, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export const LEAD_FILE_MAX_FILE_SIZE = 10 * 1048576;

export class LeadGroup extends AggregateRoot {
  protected constructor(
    public readonly id: Id,
    public readonly name: string,
    public readonly prospectCount: number,
    private _assignedTo: Id,
    public readonly createdBy: Id,
    public readonly createdAt: Date,
  ) {
    super();
  }

  public get assignedTo(): Id {
    return this._assignedTo;
  }

  static create(
    id: Id,
    name: OptionalValue<string>,
    prospectCount: number,
    assignedTo: Id,
    createdBy: Id,
  ): Result<LeadGroup> {
    return this.validateName(name).map(
      (name) => new LeadGroup(id, name, prospectCount, assignedTo, createdBy, new Date()),
    );
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => new BadRequest(DomainErrorCode.LEAD_GROUP_NAME_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.LEAD_GROUP_NAME_INVALID))
      .minLength(2, () => new BadRequest(DomainErrorCode.LEAD_GROUP_NAME_TOO_SHORT))
      .maxLength(45, () => new BadRequest(DomainErrorCode.LEAD_GROUP_NAME_TOO_LONG));
  }

  public transferLead(userId: Id): Result<void> {
    return Result.ok().onSuccess(() => {
      this._assignedTo = userId;
    });
  }
}
