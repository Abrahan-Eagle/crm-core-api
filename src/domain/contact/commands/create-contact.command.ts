import { Address, Email, Nullable, OptionalValue, Phone, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, Id, Note } from '@/domain/common';
import { normalizeFileName } from '@/domain/common/utils';

import { Contact, SUPPORTED_CONTACT_FILES } from '../entities';

type CreateAddressRequest = {
  addressLine1?: OptionalValue<string>;
  addressLine2?: OptionalValue<string>;
  state?: OptionalValue<string>;
  city?: OptionalValue<string>;
  zipCode?: OptionalValue<string>;
  countryIsoCode2?: OptionalValue<string>;
};

interface CreatePhoneRequest {
  intlPrefix: OptionalValue<string>;
  regionCode: OptionalValue<string>;
  number: OptionalValue<string>;
}

export class CreateContactCommand {
  private constructor(
    public readonly contact: Contact,
    public readonly note: Nullable<Note>,
    public readonly files: { [key in SUPPORTED_CONTACT_FILES]: BufferFile[] },
  ) {}

  static create(
    id: OptionalValue<string>,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    birthdate: OptionalValue<string>,
    ssn: OptionalValue<string>,
    address: OptionalValue<CreateAddressRequest>,
    phones: OptionalValue<CreatePhoneRequest[]>,
    emails: OptionalValue<string[]>,
    files: OptionalValue<Record<string, Express.Multer.File[]>>,
    note: OptionalValue<{
      id?: OptionalValue<string>;
      description?: OptionalValue<string>;
      level?: OptionalValue<string>;
    }>,
    userId: Nullable<Id>,
  ): Result<CreateContactCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.CONTACT_ID_EMPTY,
        () => DomainErrorCode.CONTACT_ID_INVALID,
      ) as Result<Id>,
      Address.create(
        address?.addressLine1,
        address?.addressLine2,
        address?.state,
        address?.city,
        address?.zipCode,
        address?.countryIsoCode2,
      ),
      Validator.of(phones)
        .required(() => DomainErrorCode.CONTACT_PHONES_EMPTY)
        .array(() => DomainErrorCode.CONTACT_PHONES_INVALID)
        .minLength(1, () => DomainErrorCode.CONTACT_PHONES_INVALID_SIZE)
        .flatMap((phones) =>
          Result.combine([...phones.map((phone) => Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number))]),
        ),
      Validator.of(emails)
        .required(() => DomainErrorCode.CONTACT_EMAILS_EMPTY)
        .array(() => DomainErrorCode.CONTACT_EMAILS_INVALID)
        .minLength(1, () => DomainErrorCode.CONTACT_EMAILS_INVALID_SIZE)
        .flatMap((emails) => Result.combine([...emails.map((email) => Email.createUnverified(email))])),
    ])
      .flatMap(([id, address, phones, emails]) =>
        Result.combine([
          Contact.create(id, firstName, lastName, birthdate, ssn, address, phones, emails, userId),
          note !== undefined
            ? Id.create(
                note?.id,
                () => DomainErrorCode.NOTE_ID_EMPTY,
                () => DomainErrorCode.NOTE_ID_INVALID,
              ).flatMap((noteId) => Note.create(noteId, userId!, note?.level, note?.description))
            : Result.ok(null),
          this.mapFiles(files, id),
        ]),
      )
      .map(([contact, note, files]) => new CreateContactCommand(contact, note, files));
  }

  private static mapFiles(
    files: OptionalValue<Record<string, Express.Multer.File[]>>,
    id: Id,
  ): Result<{ [key in SUPPORTED_CONTACT_FILES]: BufferFile[] }> {
    return Validator.of(files)
      .required(() => DomainErrorCode.CONTACT_FILE_TYPE_INVALID)
      .object(() => DomainErrorCode.CONTACT_FILE_TYPE_INVALID)
      .map((files) => Object.keys(files as object))
      .flatMap((keys) =>
        Result.combine(
          keys.map((key) =>
            Validator.of(key)
              .required(() => DomainErrorCode.CONTACT_FILE_TYPE_INVALID)
              .enum(SUPPORTED_CONTACT_FILES, () => DomainErrorCode.CONTACT_FILE_TYPE_INVALID),
          ),
        ),
      )
      .flatMap((keys: string[]) =>
        Result.combine(
          keys.map((key) => {
            return (
              Validator.of(files![key])
                .required(() => DomainErrorCode.CONTACT_FILES_INVALID)
                .array(() => DomainErrorCode.CONTACT_FILES_INVALID)
                .flatMap((files) =>
                  Result.combine(
                    files.map((file) =>
                      Validator.of(file)
                        .required(() => DomainErrorCode.FILE_PATH_EMPTY)
                        .map(
                          (file) =>
                            new BufferFile(
                              `${id.toString()}/${normalizeFileName(
                                Buffer.from(file.originalname, 'latin1').toString('utf8'),
                              )}`,
                              file.buffer,
                              extname(file.originalname),
                              file.mimetype,
                            ),
                        ),
                    ),
                  ),
                ) as Result<BufferFile[]>
            ).flatMap((streamFiles) => Result.ok({ [key as SUPPORTED_CONTACT_FILES]: streamFiles }));
          }),
        ),
      )
      .map((obj) => {
        return obj.reduce((acc, curr) => {
          const key = Object.keys(curr)[0];
          acc[key] = curr[key];

          return acc;
        }, {}) as { [key in SUPPORTED_CONTACT_FILES]: BufferFile[] };
      });
  }
}
