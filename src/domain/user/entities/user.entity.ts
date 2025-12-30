import * as crypto from 'node:crypto';

import {
  AggregateRoot,
  BadRequest,
  Nullable,
  OptionalValue,
  Phone,
  Result,
  Undefinable,
  Validator,
} from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

interface UpdateUserParams {
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  tenants?: Nullable<string[]>;
  phone?: Nullable<Phone>;
}

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 20;
export class User extends AggregateRoot {
  protected constructor(
    public readonly id: Id,
    private _firstName: string,
    private _lastName: string,
    public readonly email: string,
    public readonly referralId: string,
    private _roles: string[],
    private _tenants: string[],
    private _phone: Nullable<Phone>,
    public readonly createdAt: Date,
    private _updatedAt?: Date,
    private _deletedAt?: Nullable<Date>,
    public readonly version?: number,
  ) {
    super();
  }

  public get updatedAt(): Undefinable<Date> {
    return this._updatedAt && new Date(this._updatedAt);
  }

  public get deletedAt(): Nullable<Date> {
    return this._deletedAt ?? null;
  }

  public get roles(): string[] {
    return this._roles;
  }

  public get tenants(): string[] {
    return this._tenants;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get phone(): Nullable<Phone> {
    return this._phone;
  }

  isActive(): boolean {
    return !Boolean(this._deletedAt);
  }

  markAsDeleted(now = new Date()): Result<void> {
    if (this._deletedAt) return Result.fail(new BadRequest(DomainErrorCode.USER_ALREADY_DELETED));

    this._deletedAt = now;
    return Result.ok();
  }

  static create(
    id: Id,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    email: OptionalValue<string>,
    roles: OptionalValue<string[]>,
    tenants: OptionalValue<string[]>,
    createdAt?: string,
  ): Result<User> {
    return Result.combine([
      this.validateFirstName(firstName),
      this.validateLastName(lastName),
      this.validateEmail(email),
      this.validateRoles(roles),
      this.validateTenants(tenants),
      this.validateCreatedAt(createdAt),
    ]).map(
      ([firstName, lastName, email, roles, tenants, createdAt]) =>
        new User(
          id,
          firstName,
          lastName,
          email,
          crypto.randomBytes(6).toString('hex'),
          roles,
          tenants,
          null,
          createdAt,
        ),
    );
  }

  static validateFirstName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => new BadRequest(DomainErrorCode.USER_FIRST_NAME_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.USER_FIRST_NAME_INVALID))
      .minLength(MIN_NAME_LENGTH, () => new BadRequest(DomainErrorCode.USER_FIRST_NAME_TOO_SHORT))
      .maxLength(MAX_NAME_LENGTH, () => new BadRequest(DomainErrorCode.USER_FIRST_NAME_TOO_LONG));
  }

  static validateLastName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => new BadRequest(DomainErrorCode.USER_LAST_NAME_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.USER_LAST_NAME_INVALID))
      .minLength(MIN_NAME_LENGTH, () => new BadRequest(DomainErrorCode.USER_LAST_NAME_TOO_SHORT))
      .maxLength(MAX_NAME_LENGTH, () => new BadRequest(DomainErrorCode.USER_LAST_NAME_TOO_LONG));
  }

  static validateEmail(email: OptionalValue<string>): Result<string> {
    return Validator.of(email)
      .required(() => new BadRequest(DomainErrorCode.USER_EMAIL_EMPTY))
      .email(() => new BadRequest(DomainErrorCode.USER_EMAIL_INVALID))
      .map((value) => value.toLowerCase());
  }

  static validateCreatedAt(createdAt = new Date().toISOString()): Result<Date> {
    return Validator.of(createdAt).datetime(() => new BadRequest(DomainErrorCode.USER_CREATED_AT_INVALID));
  }

  static validateRoles(roles: OptionalValue<string[]>): Result<string[]> {
    return Validator.of(roles)
      .required(() => new BadRequest(DomainErrorCode.USER_ROLES_EMPTY))
      .array(() => new BadRequest(DomainErrorCode.USER_ROLES_INVALID))
      .flatMap((roles) => Result.combine(roles.map((role) => this.validateRole(role))));
  }

  static validateRole(role: OptionalValue<string>): Result<string> {
    return Validator.of(role)
      .required(() => new BadRequest(DomainErrorCode.USER_ROLE_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.USER_ROLE_INVALID));
  }

  static validateTenants(tenants: OptionalValue<string[]>): Result<string[]> {
    return Validator.of(tenants)
      .required(() => new BadRequest(DomainErrorCode.USER_TENANTS_EMPTY))
      .array(() => new BadRequest(DomainErrorCode.USER_TENANTS_INVALID))
      .flatMap((tenants) =>
        Result.combine(
          tenants.map((tenant) =>
            Validator.of(tenant)
              .required(() => new BadRequest(DomainErrorCode.TENANT_ID_EMPTY))
              .string(() => new BadRequest(DomainErrorCode.TENANT_ID_INVALID)),
          ),
        ),
      );
  }

  static validatePassword(password: OptionalValue<string>): Result<string> {
    return Validator.of(password)
      .required(() => new BadRequest(DomainErrorCode.USER_PASSWORD_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.USER_PASSWORD_INVALID))
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        () => DomainErrorCode.USER_PASSWORD_TOO_WEAK,
      );
  }

  static validateReferralId(referralId: OptionalValue<string>): Result<string> {
    return Validator.of(referralId)
      .required(() => DomainErrorCode.REFERRAL_ID_EMPTY)
      .string(() => DomainErrorCode.REFERRAL_ID_INVALID)
      .regex(/^[a-z0-9]{12}$/, () => DomainErrorCode.REFERRAL_ID_INVALID);
  }

  public addRole(role: string): Result<void> {
    return User.validateRole(role)
      .onSuccess(() => {
        this._updatedAt = new Date();
        this._roles = Array.from(new Set([...this._roles, role]));
      })
      .flatMap(() => Result.ok());
  }

  public removeRole(role: string): Result<void> {
    return User.validateRole(role)
      .onSuccess(() => {
        this._updatedAt = new Date();
        this._roles = Array.from(new Set(this._roles.filter((item) => item != role)));
      })
      .flatMap(() => Result.ok());
  }

  public updateUser(update: UpdateUserParams, now = new Date()): Result<void> {
    return Result.combine([
      update.firstName ? this.updateFirstName(update.firstName, now) : Result.ok(),
      update.lastName ? this.updateLastName(update.lastName, now) : Result.ok(),
      update.tenants ? this.updateTenants(update.tenants, now) : Result.ok(),
      update.phone ? this.updatePhone(update.phone, now) : Result.ok(),
    ]).flatMap(() => Result.ok());
  }

  private updateFirstName(firstName: OptionalValue<string>, now = new Date()): Result<void> {
    return User.validateFirstName(firstName)
      .onSuccess((validated) => {
        this._firstName = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updateLastName(lastName: OptionalValue<string>, now = new Date()): Result<void> {
    return User.validateLastName(lastName)
      .onSuccess((validated) => {
        this._lastName = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updateTenants(tenants: OptionalValue<string[]>, now = new Date()): Result<void> {
    return User.validateTenants(tenants)
      .onSuccess((validated) => {
        this._tenants = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updatePhone(phone: Phone, now = new Date()): Result<void> {
    return Result.ok().onSuccess(() => {
      this._phone = phone;
      this._updatedAt = now;
    });
  }

  public disable(): Result<void> {
    return Result.ok().onSuccess(() => {
      this._deletedAt = new Date();
      this._updatedAt = new Date();
    });
  }

  public enable(): Result<void> {
    return Result.ok().onSuccess(() => {
      this._deletedAt = undefined;
      this._updatedAt = new Date();
    });
  }
}
