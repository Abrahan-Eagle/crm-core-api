import * as crypto from 'node:crypto';

import {
  AggregateRoot,
  InvalidValueException,
  NotFound,
  Nullable,
  OptionalValue,
  Result,
  Undefinable,
  Validator,
} from '@internal/common';

import { MIN_LOAN_AMOUNT } from '@/domain/bank';
import { getPeriodFromDate, getPreviousPeriods } from '@/domain/common/utils';

import {
  ApplicationBlocked,
  ApplicationPositionNotDefined,
  BufferFile,
  DomainErrorCode,
  Id,
  PRODUCT_TYPE,
} from '../../common';
import { ApplicationDocument } from './application-document.entity';
import { ApplicationReferral } from './application-referral.entity';
import { BankNotification, NOTIFICATION_STATUS, REJECT_REASONS } from './bank-notification.entity';
import { DraftApplication } from './draft';
import { FilledApplicationDocument } from './filled-application-document.entity';
import { Offer, OFFER_STATUS, UpdateOfferParams } from './offer.entity';

const FILLED_APPLICATIONS_MIN_LENGTH = 1;
const FILLED_APPLICATIONS_MAX_LENGTH = 1;
const BANK_STATEMENTS_MIN_LENGTH = 4;
const BANK_STATEMENTS_MAX_LENGTH = 4;
const MTD_STATEMENTS_MAX_LENGTH = 1;
const CREDIT_CARD_STATEMENTS_MAX_LENGTH = 3;
const ADDITIONAL_STATEMENTS_MAX_LENGTH = 5;

export const APPLICATION_FILE_MAX_FILE_SIZE = 10 * 1048576;

export const MIN_REJECT_DESCRIPTION_LENGTH = 10;
export const MAX_REJECT_DESCRIPTION_LENGTH = 150;

export enum APPLICATION_STATUS {
  READY_TO_SEND = 'READY_TO_SEND',
  SENT = 'SENT',
  REPLIED = 'REPLIED',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  APPROVED_NOT_FUNDED = 'APPROVED_NOT_FUNDED',
  COMPLETED = 'COMPLETED',
}

export enum APPLICATION_SUBSTATUS {
  CONTRACT_REQUESTED = 'CONTRACT_REQUESTED',
  CONTRACT_SENT_TO_CUSTOMER = 'CONTRACT_SENT_TO_CUSTOMER',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  CONTRACT_NOT_SIGNED = 'CONTRACT_NOT_SIGNED',
  CONTRACT_VERIFICATION = 'CONTRACT_VERIFICATION',
  VERIFICATION_CALL = 'VERIFICATION_CALL',
}

export class Application extends AggregateRoot {
  constructor(
    public readonly id: Id,
    private _status: APPLICATION_STATUS,
    private _substatus: Nullable<APPLICATION_SUBSTATUS>,
    public readonly companyId: Id,
    public readonly trackingId: string,
    public readonly period: string,
    public readonly loanAmount: number,
    public readonly product: PRODUCT_TYPE,
    public readonly referral: Nullable<ApplicationReferral>,
    private _filledApplications: FilledApplicationDocument[],
    public readonly bankStatements: ApplicationDocument[],
    public readonly mtdStatements: ApplicationDocument[],
    public readonly creditCardStatements: ApplicationDocument[],
    public readonly additionalStatements: ApplicationDocument[],
    private _notifications: BankNotification[],
    private _rejectReason: Nullable<REJECT_REASONS>,
    private _rejectReasonDescription: Nullable<string>,
    private _createdBy: Nullable<Id>,
    private _signatureUrl: Nullable<string>,
    public readonly createdAt: Date,
    private _updatedAt: Undefinable<Date>,
    private _position: Nullable<number> = null,
    public readonly version?: number,
  ) {
    super();
  }

  get createdBy(): Nullable<Id> {
    return this._createdBy;
  }

  get signatureUrl(): Nullable<string> {
    return this._signatureUrl;
  }

  get filledApplications(): FilledApplicationDocument[] {
    return this._filledApplications;
  }

  get isApproved(): boolean {
    return APPLICATION_STATUS.APPROVED_NOT_FUNDED == this._status;
  }

  get isBlocked(): boolean {
    return [APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(this._status);
  }

  get status(): APPLICATION_STATUS {
    return this._status;
  }

  get substatus(): Nullable<APPLICATION_SUBSTATUS> {
    return this._substatus;
  }

  get notifications(): BankNotification[] {
    return [...this._notifications];
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get allFiles(): BufferFile[] {
    return [
      ...this.filledApplications,
      ...this.bankStatements,
      ...this.mtdStatements,
      ...this.creditCardStatements,
      ...this.additionalStatements,
    ]
      .map((doc) => doc.file)
      .filter(Boolean) as BufferFile[];
  }

  get allDocs(): (ApplicationDocument | FilledApplicationDocument)[] {
    return [
      ...this.filledApplications,
      ...this.bankStatements,
      ...this.mtdStatements,
      ...this.creditCardStatements,
      ...this.additionalStatements,
    ];
  }

  get rejectReason(): Nullable<REJECT_REASONS> {
    return this._rejectReason;
  }

  get rejectReasonDescription(): Nullable<string> {
    return this._rejectReasonDescription;
  }

  get position(): Nullable<number> {
    return this._position;
  }

  get getAccepted(): BankNotification[] {
    return this._notifications.filter((notification) => notification.status === NOTIFICATION_STATUS.ACCEPTED);
  }

  static validateLoanAmount(loanAmount: OptionalValue<number>): Result<number> {
    return Validator.of(loanAmount)
      .required(() => DomainErrorCode.APPLICATION_AMOUNT_EMPTY)
      .number(() => DomainErrorCode.APPLICATION_AMOUNT_INVALID)
      .min(MIN_LOAN_AMOUNT, () => DomainErrorCode.APPLICATION_AMOUNT_INVALID);
  }

  static validateTrackingId(trackingId: OptionalValue<string>): Result<string> {
    return Validator.of(trackingId)
      .required(() => DomainErrorCode.APPLICATION_TRACKING_ID_EMPTY)
      .string(() => DomainErrorCode.APPLICATION_TRACKING_ID_INVALID)
      .regex(/^[a-z0-9]{12}$/, () => DomainErrorCode.APPLICATION_TRACKING_ID_INVALID);
  }

  static validateProduct(product: OptionalValue<string>): Result<PRODUCT_TYPE> {
    return Validator.of(product)
      .required(() => DomainErrorCode.APPLICATION_PRODUCT_INVALID)
      .string(() => DomainErrorCode.APPLICATION_PRODUCT_INVALID)
      .enum(PRODUCT_TYPE, () => DomainErrorCode.APPLICATION_PRODUCT_INVALID);
  }

  static validateSubstatus(substatus: OptionalValue<string>): Result<APPLICATION_SUBSTATUS> {
    return Validator.of(substatus)
      .required(() => DomainErrorCode.APPLICATION_SUBSTATUS_EMPTY)
      .string(() => DomainErrorCode.APPLICATION_SUBSTATUS_INVALID)
      .enum(APPLICATION_SUBSTATUS, () => DomainErrorCode.APPLICATION_SUBSTATUS_INVALID);
  }

  static validateReferral(referral: OptionalValue<ApplicationReferral>): Result<Nullable<ApplicationReferral>> {
    return Validator.of(referral).mapIfAbsent(() => null);
  }

  static validateFilledApplications<T>(filledApplications: OptionalValue<T[]>): Result<T[]> {
    return Validator.of(filledApplications)
      .required(() => DomainErrorCode.APPLICATION_FILLED_APPLICATIONS_EMPTY)
      .array(() => DomainErrorCode.APPLICATION_FILLED_APPLICATIONS_INVALID)
      .notEmpty(() => DomainErrorCode.APPLICATION_FILLED_APPLICATIONS_EMPTY)
      .minLength(FILLED_APPLICATIONS_MIN_LENGTH, () => DomainErrorCode.APPLICATION_FILLED_APPLICATIONS_TOO_FEW)
      .maxLength(FILLED_APPLICATIONS_MAX_LENGTH, () => DomainErrorCode.APPLICATION_FILLED_APPLICATIONS_TOO_MANY);
  }

  static validateBankStatements<T extends { period?: Nullable<string> }>(
    bankStatements: OptionalValue<T[]>,
  ): Result<T[]> {
    return Validator.of(bankStatements)
      .required(() => DomainErrorCode.APPLICATION_BANK_STATEMENTS_EMPTY)
      .array(() => DomainErrorCode.APPLICATION_BANK_STATEMENTS_INVALID)
      .notEmpty(() => DomainErrorCode.APPLICATION_BANK_STATEMENTS_EMPTY)
      .minLength(BANK_STATEMENTS_MIN_LENGTH, () => DomainErrorCode.APPLICATION_BANK_STATEMENTS_TOO_FEW)
      .maxLength(BANK_STATEMENTS_MAX_LENGTH, () => DomainErrorCode.APPLICATION_BANK_STATEMENTS_TOO_MANY)
      .validate(
        (values) => this.ensurePeriodsInArray(values.map((value) => value?.period)),
        () => DomainErrorCode.APPLICATION_BANK_STATEMENTS_INVALID_PERIOD,
      );
  }

  static validateMTDStatements<T>(MTDStatements: OptionalValue<T[]>): Result<T[]> {
    return Validator.of(MTDStatements)
      .required(() => DomainErrorCode.APPLICATION_MTD_STATEMENTS_EMPTY)
      .array(() => DomainErrorCode.APPLICATION_MTD_STATEMENTS_INVALID)
      .maxLength(MTD_STATEMENTS_MAX_LENGTH, () => DomainErrorCode.APPLICATION_MTD_STATEMENTS_TOO_MANY);
  }

  static validateCreditCardStatements<T extends { period?: Nullable<string> }>(
    creditCardStatements: OptionalValue<T[]>,
  ): Result<T[]> {
    return Validator.of(creditCardStatements)
      .required(() => DomainErrorCode.APPLICATION_CREDIT_CARD_STATEMENTS_EMPTY)
      .array(() => DomainErrorCode.APPLICATION_CREDIT_CARD_STATEMENTS_INVALID)
      .maxLength(CREDIT_CARD_STATEMENTS_MAX_LENGTH, () => DomainErrorCode.APPLICATION_CREDIT_CARD_STATEMENTS_TOO_MANY)
      .validate(
        (values) =>
          this.ensurePeriodsInArray(
            values.map((value) => value?.period),
            values.length,
          ),
        () => DomainErrorCode.APPLICATION_CREDIT_CARD_STATEMENTS_INVALID_PERIOD,
      );
  }

  static validateAdditionalStatements<T extends { period?: Nullable<string> }>(
    additionalStatements: OptionalValue<T[]>,
  ): Result<T[]> {
    return Validator.of(additionalStatements)
      .required(() => DomainErrorCode.APPLICATION_ADDITIONAL_STATEMENTS_EMPTY)
      .array(() => DomainErrorCode.APPLICATION_ADDITIONAL_STATEMENTS_INVALID)
      .maxLength(ADDITIONAL_STATEMENTS_MAX_LENGTH, () => DomainErrorCode.APPLICATION_ADDITIONAL_STATEMENTS_TOO_MANY);
  }

  static validateRejectReason(reason: OptionalValue<string>): Result<REJECT_REASONS> {
    return Validator.of(reason)
      .required(() => DomainErrorCode.APPLICATION_REJECT_REASON_EMPTY)
      .enum(REJECT_REASONS, () => DomainErrorCode.APPLICATION_REJECT_REASON_INVALID);
  }

  static validateRejectDescription(
    reason: OptionalValue<string>,
    description: OptionalValue<string>,
  ): Result<Nullable<string>> {
    return this.validateRejectReason(reason).flatMap<string | null>((value) =>
      value == REJECT_REASONS.OTHER
        ? Validator.of(description)
            .required(() => DomainErrorCode.APPLICATION_REJECT_OTHER_EMPTY)
            .string(() => DomainErrorCode.APPLICATION_REJECT_REASON_INVALID)
            .map((value) => value.trim())
            .mapIfAbsent(() => null)
            .string(() => DomainErrorCode.APPLICATION_REJECT_OTHER_INVALID)
            .minLength(MIN_REJECT_DESCRIPTION_LENGTH, () => DomainErrorCode.APPLICATION_REJECT_OTHER_TOO_SHORT)
            .maxLength(MAX_REJECT_DESCRIPTION_LENGTH, () => DomainErrorCode.APPLICATION_REJECT_OTHER_TOO_LONG)
        : Result.ok(null),
    );
  }

  static validatePosition(position: OptionalValue<number>): Result<Nullable<number>> {
    return Validator.of(position)
      .mapIfAbsent(() => null)
      .number(() => DomainErrorCode.APPLICATION_POSITION_INVALID)
      .min(1, () => DomainErrorCode.POSITION_TOO_LOW)
      .max(5, () => DomainErrorCode.POSITION_TOO_HIGH);
  }

  static ensurePeriodsInArray(targetPeriods: OptionalValue<string>[], periodsBack: number = 4): boolean {
    if (!targetPeriods) return false;

    const generatedPeriods = getPreviousPeriods(new Date(), periodsBack);

    const missingPeriods = targetPeriods.filter((targetPeriod) => !generatedPeriods.includes(String(targetPeriod)));

    return missingPeriods.length === 0;
  }

  private validateNoDuplicateFiles(): Result<void> {
    const files = [
      ...this.filledApplications,
      ...this.bankStatements,
      ...this.mtdStatements,
      ...this.creditCardStatements,
      ...this.additionalStatements,
    ].map((file) => file.name);

    const uniqueFiles = new Set<string>(files);
    const hasDuplicates = files.length !== uniqueFiles.size;

    return Validator.of([]).validate(
      () => !hasDuplicates,
      () => DomainErrorCode.DUPLICATE_FILE_NAMES_PRESENT,
    );
  }

  static create(
    id: Id,
    companyId: Id,
    loanAmount: OptionalValue<number>,
    product: OptionalValue<string>,
    referral: OptionalValue<ApplicationReferral>,
    bankStatements: ApplicationDocument[],
    mtdStatements: ApplicationDocument[],
    creditCardStatements: ApplicationDocument[],
    additionalStatements: ApplicationDocument[],
    createdBy: Nullable<Id>,
    signatureUrl?: Nullable<string>,
  ): Result<Application> {
    const createdAt = new Date();

    const period = getPeriodFromDate(new Date());

    const app = Result.combine({
      loanAmount: this.validateLoanAmount(loanAmount),
      product: this.validateProduct(product),
      referral: this.validateReferral(referral),
      bankStatements: this.validateBankStatements(bankStatements),
      mtdStatements: mtdStatements ? this.validateMTDStatements(mtdStatements) : Result.ok(null),
      creditCardStatements: creditCardStatements
        ? this.validateCreditCardStatements(creditCardStatements)
        : Result.ok(null),
      additionalStatements: additionalStatements
        ? this.validateAdditionalStatements(additionalStatements)
        : Result.ok(null),
    })
      .map(
        ({ loanAmount, product, referral }) =>
          new Application(
            id,
            APPLICATION_STATUS.READY_TO_SEND,
            null,
            companyId,
            crypto.randomBytes(6).toString('hex'),
            period,
            loanAmount,
            product,
            referral,
            [],
            bankStatements,
            mtdStatements,
            creditCardStatements,
            additionalStatements,
            [],
            null,
            null,
            createdBy,
            signatureUrl || null,
            createdAt,
            createdAt,
            null,
          ),
      )
      .getOrThrow();

    return app.validateNoDuplicateFiles().map(() => app);
  }

  public addNotification(notification: BankNotification): Result<void> {
    return Validator.of(this._position)
      .required(() => new ApplicationPositionNotDefined())
      .map(() => [...this._notifications, notification])
      .unique(
        (notification) => notification.bankId.toString(),
        () => DomainErrorCode.NOTIFICATION_BANK_DUPLICATED,
      )
      .onSuccess(() => {
        this._notifications.push(notification);
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  private getNotificationById(id: Id): Validator<BankNotification> {
    const index = this._notifications.findIndex((notification) => notification.id.equals(id));
    return Validator.of(index)
      .min(0, () => NotFound.of(BankNotification, id.toString()))
      .map((index) => this._notifications.at(index))
      .required(() => NotFound.of(BankNotification, id.toString()));
  }

  public updateNotificationStatus(id: Id, status: NOTIFICATION_STATUS): Result<void> {
    return this.getNotificationById(id)
      .flatMap((notification) => notification.updateStatus(status))
      .onSuccess(() => {
        if (this._status === APPLICATION_STATUS.READY_TO_SEND && NOTIFICATION_STATUS.SENT) {
          this._status = APPLICATION_STATUS.SENT;
        }

        this._updatedAt = new Date();
      });
  }

  public reject(reason: REJECT_REASONS, description: Nullable<string>) {
    return Result.combine([
      this.updateStatus(APPLICATION_STATUS.REJECTED),
      this.updateRejectReason(reason),
      this.updateRejectReasonDescription(description),
    ]);
  }

  public markAsCompleted(): Result<void> {
    return Validator.of(this._status)
      .validate(
        (status) => status === APPLICATION_STATUS.OFFER_ACCEPTED,
        () => DomainErrorCode.APPLICATION_NOT_APPROVED,
      )
      .flatMap(
        () =>
          Validator.of(this.getAccepted).validate(
            (accepted) => accepted.length > 0,
            () => new InvalidValueException(`Accepted notification not found in ${this.id.toString()}`),
          ) as Result<BankNotification[]>,
      )
      .flatMap((notifications) =>
        Result.combine(
          notifications.map((notification) =>
            Validator.of(notification.getAccepted).validate(
              (accepted) => accepted.length > 0,
              () => new InvalidValueException(`Accepted offer not found in ${this.id.toString()}`),
            ),
          ),
        ),
      )
      .onSuccess(() => {
        // this.apply(new ApplicationAcceptedEvent(this.id, this.companyId, notification.bankId, offer.commission));
        this._status = APPLICATION_STATUS.COMPLETED;
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  private updateStatus(status: APPLICATION_STATUS): Result<void> {
    return Result.ok().onSuccess(() => {
      this._status = status;
      this._updatedAt = new Date();
    });
  }

  private updateRejectReason(reason: Nullable<REJECT_REASONS>): Result<void> {
    return Result.ok().onSuccess(() => {
      this._rejectReason = reason;
      this._updatedAt = new Date();
    });
  }

  private updateRejectReasonDescription(description: Nullable<string>): Result<void> {
    return Result.ok().onSuccess(() => {
      this._rejectReasonDescription = description;
      this._updatedAt = new Date();
    });
  }

  public rejectNotification(id: Id, reason: REJECT_REASONS, other: Nullable<string>): Result<void> {
    return this.getNotificationById(id)
      .flatMap((notification) =>
        Result.combine([
          notification.updateStatus(NOTIFICATION_STATUS.REJECTED),
          notification.updateRejectReason(reason),
          notification.updateRejectReasonDescription(other),
        ]),
      )
      .flatMap(() => Result.ok())
      .onSuccess(() => {
        // Verificar si hay alguna notificación con oferta aceptada
        const hasAcceptedOffer = this._notifications.some(
          (notification) => notification.status === NOTIFICATION_STATUS.ACCEPTED,
        );

        if (hasAcceptedOffer) {
          this._status = APPLICATION_STATUS.OFFER_ACCEPTED;
        } else {
          // Verificar si hay ofertas pendientes (no ON_HOLD) en todas las notificaciones
          const hasPendingOffers = this._notifications.some((notification) =>
            notification.offers.some((offer) => offer.status !== OFFER_STATUS.ON_HOLD),
          );

          if (!hasPendingOffers) {
            // Si no hay ofertas pendientes, devolver al estado correcto
            // Si el estado actual es SENT, cambiar a REPLIED
            // Si el estado actual es OFFERED, cambiar a REPLIED
            if (
              this._status === APPLICATION_STATUS.SENT ||
              this._status === APPLICATION_STATUS.OFFERED
            ) {
              this._status = APPLICATION_STATUS.REPLIED;
            }
          } else {
            // Si hay ofertas pendientes, mantener estado OFFERED
            this._status = APPLICATION_STATUS.OFFERED;
          }
        }
        this._updatedAt = new Date();
      });
  }

  public restoreNotification(id: Id): Result<void> {
    return this.getNotificationById(id)
      .flatMap((notification) => notification.restore())
      .flatMap(() => Result.ok())
      .onSuccess(() => {
        this._updatedAt = new Date();
      });
  }

  public addOffer(notificationId: Id, offer: Offer): Result<void> {
    return this.getNotificationById(notificationId)
      .flatMap((notification) => notification.addOffer(offer))
      .onSuccess(() => {
        this._status = APPLICATION_STATUS.OFFERED;
        this._updatedAt = new Date();
      });
  }

  public acceptOffer(notificationId: Id, offerId: Id): Result<void> {
    return this.getNotificationById(notificationId)
      .flatMap((notification) => notification.acceptOffer(offerId))
      .onSuccess(() => {
        this._status = APPLICATION_STATUS.OFFER_ACCEPTED;
        this._updatedAt = new Date();
      });
  }

  public updateOffer(notificationId: Id, offerId: Id, update: UpdateOfferParams): Result<void> {
    return this.getNotificationById(notificationId).flatMap((notification) =>
      notification.updateOffer(offerId, update),
    );
  }

  public updateSubstatus(substatus: APPLICATION_SUBSTATUS): Result<void> {
    return Result.ok().onSuccess(() => {
      this._substatus = substatus;
      this._updatedAt = new Date();
    });
  }

  public setPosition(position: OptionalValue<number>): Result<void> {
    return Validator.of(this._status)
      .validate(
        (status) => status === APPLICATION_STATUS.READY_TO_SEND,
        () => new ApplicationBlocked(this.status),
      )
      .flatMap(() => Application.validatePosition(position))
      .onSuccess((validatedPosition) => {
        this._position = validatedPosition;
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  public cancelOffer(notificationId: Id, offerId: Id): Result<void> {
    return this.getNotificationById(notificationId)
      .flatMap((notification) => notification.cancelOffer(offerId))
      .onSuccess(() => {
        // Verificar si hay alguna notificación con oferta aceptada
        const hasAcceptedOffer = this._notifications.some(
          (notification) => notification.status === NOTIFICATION_STATUS.ACCEPTED,
        );

        if (hasAcceptedOffer) {
          this._status = APPLICATION_STATUS.OFFER_ACCEPTED;
        } else {
          // Verificar si hay ofertas pendientes (no ON_HOLD) en todas las notificaciones
          const hasPendingOffers = this._notifications.some((notification) =>
            notification.offers.some((offer) => offer.status !== OFFER_STATUS.ON_HOLD),
          );

          if (!hasPendingOffers) {
            // Si no hay ofertas pendientes, devolver al estado anterior apropiado
            // Si hay notificaciones con estado REPLIED o SENT, usar REPLIED
            // Si todas están REJECTED o no hay notificaciones, usar SENT
            const hasRepliedOrSentNotifications = this._notifications.some(
              (notification) =>
                notification.status === NOTIFICATION_STATUS.REPLIED ||
                notification.status === NOTIFICATION_STATUS.SENT,
            );

            this._status = hasRepliedOrSentNotifications
              ? APPLICATION_STATUS.REPLIED
              : APPLICATION_STATUS.SENT;
          } else {
            // Si hay ofertas pendientes, mantener estado OFFERED
            this._status = APPLICATION_STATUS.OFFERED;
          }
        }
        this._updatedAt = new Date();
      });
  }

  public clone(id: Id): Result<Application> {
    return Application.create(
      id,
      this.companyId,
      this.loanAmount,
      this.product,
      this.referral,
      this.bankStatements,
      this.mtdStatements,
      this.creditCardStatements,
      this.additionalStatements,
      this.createdBy,
      this.signatureUrl,
    );
  }

  static createFromDraft(draft: DraftApplication): Result<Application> {
    return Application.create(
      draft.id,
      draft.companyId,
      draft.loanAmount,
      draft.product,
      draft.referral,
      draft.bankStatements.map((statement) => ApplicationDocument.createFromDraft(statement)),
      [],
      [],
      [],
      draft.createdBy,
      draft.signatureUrl,
    );
  }

  public setFilledApplication(filledApplications: FilledApplicationDocument[]): Result<void> {
    return Application.validateFilledApplications(filledApplications)
      .onSuccess((apps) => {
        this._filledApplications = apps;
        this._updatedAt = new Date();
      })
      .flatMap(() => Result.ok());
  }

  public transfer(userId: Id): Result<void> {
    return Result.ok().onSuccess(() => {
      this._createdBy = userId;
      this._updatedAt = new Date();
    });
  }
}
