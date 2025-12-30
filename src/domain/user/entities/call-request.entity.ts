import { AggregateRoot, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export enum CALL_ENTITY_TYPE {
  COMPANY = 'COMPANY',
  CONTACT = 'CONTACT',
  BANK = 'BANK',
  PROSPECT = 'PROSPECT',
}

export class CallRequest extends AggregateRoot {
  protected constructor(
    public readonly userId: Id,
    public readonly entityType: CALL_ENTITY_TYPE,
    public readonly entityId: Id,
    public readonly phoneIndex: number,
  ) {
    super();
  }

  static create(
    userId: Id,
    entityId: Id,
    entityType: OptionalValue<string>,
    phoneIndex: OptionalValue<number>,
  ): Result<CallRequest> {
    return Result.combine([this.validateEntityType(entityType), this.validatePhoneIndex(phoneIndex)]).map(
      ([type, index]) => new CallRequest(userId, type, entityId, index),
    );
  }

  static validateEntityType(entityType: OptionalValue<string>): Result<CALL_ENTITY_TYPE> {
    return Validator.of(entityType)
      .required(() => DomainErrorCode.CALL_ENTITY_TYPE_EMPTY)
      .string(() => DomainErrorCode.CALL_ENTITY_TYPE_INVALID)
      .enum(CALL_ENTITY_TYPE, () => DomainErrorCode.CALL_ENTITY_TYPE_INVALID);
  }

  static validatePhoneIndex(phoneIndex: OptionalValue<number>): Result<number> {
    return Validator.of(phoneIndex)
      .required(() => DomainErrorCode.CALL_PHONE_INDEX_EMPTY)
      .number(() => DomainErrorCode.CALL_PHONE_INDEX_INVALID)
      .min(0, () => DomainErrorCode.CALL_PHONE_INDEX_INVALID)
      .max(10, () => DomainErrorCode.CALL_PHONE_INDEX_INVALID);
  }
}
