import { NotFound, Nullable, OptionalValue, Result, Undefinable, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '../../common';
import { Offer, OFFER_STATUS, UpdateOfferParams } from './offer.entity';

export const MIN_MESSAGE_LENGTH = 15;
export const MAX_MESSAGE_LENGTH = 800;

export const MIN_REJECT_OTHER_LENGTH = 2;
export const MAX_REJECT_OTHER_LENGTH = 150;

export enum NOTIFICATION_STATUS {
  PENDING = 'PENDING',
  SENT = 'SENT',
  REPLIED = 'REPLIED',
  REJECTED = 'REJECTED',
  OFFERED = 'OFFERED',
  ACCEPTED = 'ACCEPTED',
}

export enum REJECT_REASONS {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_TRANSACTIONS = 'INSUFFICIENT_TRANSACTIONS',
  HIGH_RISK_CLIENT = 'HIGH_RISK_CLIENT',
  LOW_CREDIT_SCORE = 'LOW_CREDIT_SCORE',
  UNSTABLE_EMPLOYMENT_HISTORY = 'UNSTABLE_EMPLOYMENT_HISTORY',
  EXCESSIVE_DEBT = 'EXCESSIVE_DEBT',
  INCOMPLETE_APPLICATION = 'INCOMPLETE_APPLICATION',
  UNVERIFIABLE_INFORMATION = 'UNVERIFIABLE_INFORMATION',
  LOAN_AMOUNT_TOO_HIGH = 'LOAN_AMOUNT_TOO_HIGH',
  EXCESSIVE_LOAN_REQUESTS = 'EXCESSIVE_LOAN_REQUESTS',
  NON_COMPLIANT_WITH_POLICY = 'NON_COMPLIANT_WITH_POLICY',
  UNSTABLE_FINANCIAL_HISTORY = 'UNSTABLE_FINANCIAL_HISTORY',
  INSUFFICIENT_COLLATERAL = 'INSUFFICIENT_COLLATERAL',
  BUSINESS_NOT_ELIGIBLE = 'BUSINESS_NOT_ELIGIBLE',
  HIGH_DEFAULT_RISK_IN_INDUSTRY = 'HIGH_DEFAULT_RISK_IN_INDUSTRY',
  LOW_REVENUE = 'LOW_REVENUE',
  EXCESSIVE_NEGATIVE_DAYS = 'EXCESSIVE_NEGATIVE_DAYS',
  CLOSED_BY_OTHER_COMPANY = 'CLOSED_BY_OTHER_COMPANY',
  OTHER = 'OTHER',
}

export class BankNotification {
  constructor(
    public readonly id: Id,
    public readonly bankId: Id,
    private _status: NOTIFICATION_STATUS,
    private _rejectReason: Nullable<REJECT_REASONS>,
    private _rejectReasonDescription: Nullable<string>,
    public _offers: Offer[],
    public readonly createdAt: Date,
    private _updatedAt: Undefinable<Date>,
  ) {}

  get offers(): Offer[] {
    return this._offers;
  }

  get status(): NOTIFICATION_STATUS {
    return this._status;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get rejectReason(): Nullable<REJECT_REASONS> {
    return this._rejectReason;
  }

  get rejectReasonDescription(): Nullable<string> {
    return this._rejectReasonDescription;
  }

  get getAccepted(): Offer[] {
    return this._offers.filter((offer) => offer.status === OFFER_STATUS.ACCEPTED);
  }

  static create(bankId: Id): Result<BankNotification> {
    const createdAt = new Date();

    return Result.ok(
      new BankNotification(Id.empty(), bankId, NOTIFICATION_STATUS.PENDING, null, null, [], createdAt, createdAt),
    );
  }

  static validateNotificationMessage(message: OptionalValue<string>): Result<string> {
    return Validator.of(message)
      .required(() => DomainErrorCode.NOTIFICATION_MESSAGE_EMPTY)
      .string(() => DomainErrorCode.NOTIFICATION_MESSAGE_INVALID)
      .minLength(MIN_MESSAGE_LENGTH, () => DomainErrorCode.NOTIFICATION_MESSAGE_TOO_SHORT)
      .maxLength(MAX_MESSAGE_LENGTH, () => DomainErrorCode.NOTIFICATION_MESSAGE_TOO_LONG);
  }

  static validateRejectDescription(description: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(description)
      .mapIfAbsent(() => null)
      .string(() => DomainErrorCode.NOTIFICATION_REJECT_OTHER_INVALID)
      .minLength(MIN_REJECT_OTHER_LENGTH, () => DomainErrorCode.NOTIFICATION_REJECT_OTHER_TOO_SHORT)
      .maxLength(MAX_REJECT_OTHER_LENGTH, () => DomainErrorCode.NOTIFICATION_REJECT_OTHER_TOO_LONG);
  }

  public qualifiesForRejection(): boolean {
    return this._status !== NOTIFICATION_STATUS.ACCEPTED && this._status !== NOTIFICATION_STATUS.REJECTED;
  }

  public updateStatus(status: NOTIFICATION_STATUS): Result<void> {
    return Result.ok().onSuccess(() => {
      this._status = status;
      this._updatedAt = new Date();
    });
  }

  public restore(): Result<void> {
    return Result.ok().onSuccess(() => {
      this._status = this._offers.length > 0 ? NOTIFICATION_STATUS.REPLIED : NOTIFICATION_STATUS.SENT;
      this._rejectReason = null;
      this._rejectReasonDescription = null;
      this._updatedAt = new Date();
    });
  }

  static validateRejectReason(reason: OptionalValue<string>): Result<REJECT_REASONS> {
    return Validator.of(reason)
      .required(() => DomainErrorCode.NOTIFICATION_REJECT_REASON_EMPTY)
      .enum(REJECT_REASONS, () => DomainErrorCode.NOTIFICATION_REJECT_REASON_INVALID);
  }

  public updateRejectReason(reason: REJECT_REASONS): Result<void> {
    return Result.ok().onSuccess(() => {
      this._rejectReason = reason;
      this._updatedAt = new Date();
    });
  }

  public updateRejectReasonDescription(description: Nullable<string>): Result<void> {
    return BankNotification.validateRejectDescription(description)
      .onSuccess(() => {
        this._rejectReasonDescription = description;
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  public addOffer(offer: Offer): Result<void> {
    return Validator.of(this._offers.findIndex((v) => v.id.equals(offer.id)))
      .max(-1, () => DomainErrorCode.OFFER_ID_DUPLICATED)
      .onSuccess(() => {
        this._offers.push(offer);
        this._status = NOTIFICATION_STATUS.OFFERED;
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  private getOfferById(id: Id, status: OFFER_STATUS | null = null): Validator<Offer> {
    const index = this._offers.findIndex((offer) =>
      status ? offer.id.equals(id) && offer.status === status : offer.id.equals(id),
    );
    return Validator.of(index)
      .min(0, () => NotFound.of(Offer, id.toString()))
      .map((index) => this._offers.at(index))
      .required(() => NotFound.of(Offer, id.toString()));
  }

  public acceptOffer(id: Id): Result<void> {
    return this.getOfferById(id)
      .flatMap((offer) => offer.accept())
      .onSuccess(() => {
        this._status = NOTIFICATION_STATUS.ACCEPTED;
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  public updateOffer(id: Id, update: UpdateOfferParams): Result<void> {
    return this.getOfferById(id).flatMap((offer) => offer.update(update));
  }

  public cancelOffer(id: Id): Result<void> {
    return this.getOfferById(id, OFFER_STATUS.ACCEPTED)
      .flatMap((offer) => offer.cancel())
      .onSuccess(() => {
        this._status = this._offers.some((offer) => offer.status === OFFER_STATUS.ACCEPTED)
          ? NOTIFICATION_STATUS.ACCEPTED
          : NOTIFICATION_STATUS.OFFERED;

        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }
}
