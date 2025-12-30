import { Nullable, OptionalValue, Result, Undefinable, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';
import { hasMaxDecimals } from '@/domain/common/utils';

export type UpdateOfferParams = {
  purchasedAmount?: Nullable<number>;
  factorRate?: Nullable<number>;
  position?: Nullable<number>;
  points?: Nullable<number>;
  paymentPlan?: Nullable<string>;
  paymentPlanDuration?: Nullable<number>;
};

export enum OFFER_PAYMENT_PLAN {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum OFFER_STATUS {
  ON_HOLD = 'ON_HOLD',
  ACCEPTED = 'ACCEPTED',
}

const FACTOR_MIN = 0;
const FACTOR_MAX = 3;

const POSITION_MIN = 1;
const POSITION_MAX = 10;

const POINTS_MIN = 0;
const POINTS_MAX = 14;

export class Offer {
  constructor(
    public readonly id: Id,
    private _purchasedAmount: number,
    private _factorRate: Nullable<number>,
    private _position: Nullable<number>,
    private _points: Nullable<number>,
    private _paymentPlan: Nullable<OFFER_PAYMENT_PLAN>,
    private _paymentPlanDuration: Nullable<number>,
    private _status: OFFER_STATUS,
    public readonly createdAt: Date,
    private _updatedAt: Undefinable<Date>,
  ) {}

  get purchasedPrice(): number {
    if (this._factorRate === null) return 0;
    return Number((this._purchasedAmount * this._factorRate).toFixed(2));
  }

  get purchasedAmount(): number {
    return this._purchasedAmount;
  }

  get factorRate(): Nullable<number> {
    return this._factorRate;
  }

  get commission(): number {
    if (this._points === null) return 0;
    return Number(((this._points / 100) * this._purchasedAmount).toFixed(2));
  }

  get position(): Nullable<number> {
    return this._position;
  }

  get points(): Nullable<number> {
    return this._points;
  }

  get paymentPlan(): Nullable<OFFER_PAYMENT_PLAN> {
    return this._paymentPlan;
  }

  get paymentPlanDuration(): Nullable<number> {
    return this._paymentPlanDuration;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get status(): OFFER_STATUS {
    return this._status;
  }

  static create(
    id: Id,
    purchasedAmount: OptionalValue<number>,
    factorRate: OptionalValue<number>,
    position: OptionalValue<number>,
    points: OptionalValue<number>,
    paymentPlan: OptionalValue<string>,
    paymentPlanDuration: OptionalValue<number>,
  ): Result<Offer> {
    const createdAt = new Date();

    return Result.combine([
      this.validatePurchasedAmount(purchasedAmount),
      this.validateFactorRate(factorRate),
      this.validatePosition(position),
      this.validatePoints(points),
      this.validatePaymentPlan(paymentPlan),
      this.validatePaymentPlanDuration(paymentPlanDuration),
    ]).map((params) => new Offer(id, ...params, OFFER_STATUS.ON_HOLD, createdAt, createdAt));
  }

  static validatePurchasedAmount(purchasedAmount: OptionalValue<number>): Result<number> {
    return Validator.of(purchasedAmount)
      .required(() => DomainErrorCode.OFFER_AMOUNT_EMPTY)
      .number(() => DomainErrorCode.OFFER_AMOUNT_INVALID)
      .min(0, () => DomainErrorCode.OFFER_AMOUNT_INVALID)
      .validate(
        (number) => !hasMaxDecimals(number),
        () => DomainErrorCode.OFFER_AMOUNT_INVALID,
      );
  }

  static validateFactorRate(factorRate: OptionalValue<number>): Result<Nullable<number>> {
    return Validator.of(factorRate)
      .number(() => DomainErrorCode.OFFER_RATE_INVALID)
      .min(FACTOR_MIN, () => DomainErrorCode.OFFER_RATE_INVALID)
      .max(FACTOR_MAX, () => DomainErrorCode.OFFER_RATE_INVALID)
      .validate(
        (number) => !hasMaxDecimals(number),
        () => DomainErrorCode.OFFER_RATE_INVALID,
      )
      .mapIfAbsent(() => null);
  }

  static validatePosition(position: OptionalValue<number>): Result<Nullable<number>> {
    return Validator.of(position)
      .number(() => DomainErrorCode.OFFER_POSITION_INVALID)
      .min(POSITION_MIN, () => DomainErrorCode.OFFER_POSITION_INVALID)
      .max(POSITION_MAX, () => DomainErrorCode.OFFER_POSITION_INVALID)
      .validate(
        (number) => Number.isInteger(number),
        () => DomainErrorCode.OFFER_POSITION_INVALID,
      )
      .mapIfAbsent(() => null);
  }

  static validatePoints(points: OptionalValue<number>): Result<Nullable<number>> {
    return Validator.of(points)
      .number(() => DomainErrorCode.OFFER_POINTS_INVALID)
      .min(POINTS_MIN, () => DomainErrorCode.OFFER_POINTS_INVALID)
      .max(POINTS_MAX, () => DomainErrorCode.OFFER_POINTS_INVALID)
      .validate(
        (number) => Number.isInteger(number),
        () => DomainErrorCode.OFFER_POINTS_INVALID,
      )
      .mapIfAbsent(() => null);
  }

  static validatePaymentPlan(paymentPlan: OptionalValue<string>): Result<Nullable<OFFER_PAYMENT_PLAN>> {
    return Validator.of(paymentPlan)
      .string(() => DomainErrorCode.OFFER_PAYMENT_PLAN_INVALID)
      .enum(OFFER_PAYMENT_PLAN, () => DomainErrorCode.OFFER_PAYMENT_PLAN_INVALID)
      .mapIfAbsent(() => null);
  }

  static validatePaymentPlanDuration(duration: OptionalValue<number>): Result<Nullable<number>> {
    return Validator.of(duration)
      .number(() => DomainErrorCode.OFFER_PAYMENT_PLAN_DURATION_INVALID)
      .min(0, () => DomainErrorCode.OFFER_PAYMENT_PLAN_DURATION_INVALID)
      .max(1000, () => DomainErrorCode.OFFER_PAYMENT_PLAN_DURATION_INVALID)
      .mapIfAbsent(() => null);
  }

  public accept() {
    return Result.ok().onSuccess(() => {
      this._status = OFFER_STATUS.ACCEPTED;
      this._updatedAt = new Date();
    });
  }

  public cancel() {
    return Result.ok().onSuccess(() => {
      this._status = OFFER_STATUS.ON_HOLD;
      this._updatedAt = new Date();
    });
  }

  public updatePurchasedAmount(purchasedAmount: OptionalValue<number>, now = new Date()): Result<void> {
    return Offer.validatePurchasedAmount(purchasedAmount)
      .onSuccess((validated) => {
        this._purchasedAmount = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateFactorRate(factorRate: OptionalValue<number>, now = new Date()): Result<void> {
    return Offer.validateFactorRate(factorRate)
      .onSuccess((validated) => {
        this._factorRate = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updatePosition(position: OptionalValue<number>, now = new Date()): Result<void> {
    return Offer.validatePosition(position)
      .onSuccess((validated) => {
        this._position = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updatePoints(points: OptionalValue<number>, now = new Date()): Result<void> {
    return Offer.validatePoints(points)
      .onSuccess((validated) => {
        this._points = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updatePaymentPlan(paymentPlan: OptionalValue<string>, now = new Date()): Result<void> {
    return Offer.validatePaymentPlan(paymentPlan)
      .onSuccess((validated) => {
        this._paymentPlan = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updatePaymentPlanDuration(duration: OptionalValue<number>, now = new Date()): Result<void> {
    return Offer.validatePaymentPlanDuration(duration)
      .onSuccess((validated) => {
        this._paymentPlanDuration = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  update(update: UpdateOfferParams, now = new Date()): Result<void> {
    return Result.combine([
      this.updatePurchasedAmount(update.purchasedAmount, now),
      this.updateFactorRate(update.factorRate, now),
      this.updatePosition(update.position, now),
      this.updatePoints(update.points, now),
      this.updatePaymentPlan(update.paymentPlan, now),
      this.updatePaymentPlanDuration(update.paymentPlanDuration, now),
    ]).flatMap(() => Result.ok());
  }
}
