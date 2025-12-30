import { BadRequest, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '@/domain/common';

export enum BANK_TERRITORY {
  US = 'US',
  PR = 'PR',
  CA = 'CA',
}

export class BankTerritory {
  constructor(
    public readonly territory: BANK_TERRITORY,
    public readonly excludedStates: string[],
  ) {}

  static create(territory: OptionalValue<string>, excludedStates: OptionalValue<string[]>): Result<BankTerritory> {
    return Result.combine([
      BankTerritory.validateTerritory(territory),
      BankTerritory.validateStates(excludedStates),
    ]).map((params) => new BankTerritory(...params));
  }

  static validateTerritory(territory: OptionalValue<string>): Result<BANK_TERRITORY> {
    return Validator.of(territory)
      .required(() => DomainErrorCode.BANK_TERRITORY_EMPTY)
      .string(() => DomainErrorCode.BANK_TERRITORY_INVALID)
      .enum(BANK_TERRITORY, () => DomainErrorCode.BANK_TERRITORY_INVALID);
  }

  static validateStates(states: OptionalValue<string[]>): Result<string[]> {
    return Validator.of(states)
      .required(() => DomainErrorCode.BANK_EXCLUDED_STATE_INVALID)
      .array(() => DomainErrorCode.BANK_EXCLUDED_STATE_INVALID)
      .flatMap((states) =>
        Result.combine(
          states.map((state) =>
            Validator.of(state)
              .required(() => DomainErrorCode.BANK_EXCLUDED_STATE_EMPTY)
              .string(() => DomainErrorCode.BANK_EXCLUDED_STATE_INVALID)
              .map((id) => id.trim())
              .minLength(1, () => DomainErrorCode.BANK_EXCLUDED_STATE_TOO_SHORT)
              .maxLength(60, () => DomainErrorCode.BANK_EXCLUDED_STATE_TOO_LONG),
          ),
        ),
      )
      .validate(
        (ids) => new Set(ids).size === ids.length,
        () => new BadRequest(DomainErrorCode.BANK_EXCLUDED_STATE_DUPLICATED),
      );
  }
}
