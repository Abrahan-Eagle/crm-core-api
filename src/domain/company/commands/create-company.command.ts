import { Address, Email, Nullable, OptionalValue, Phone, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, ENTITY_TYPE, Id, Industry, Note, TaxId } from '@/domain/common';
import { normalizeFileName } from '@/domain/common/utils';

import { Company, CompanyMember, SUPPORTED_COMPANY_FILES } from '../entities';

type CreateCompanyAddressRequest = {
  addressLine1: OptionalValue<string>;
  addressLine2: OptionalValue<string>;
  city: OptionalValue<string>;
  state: OptionalValue<string>;
  zipCode: OptionalValue<string>;
  countryIsoCode2: OptionalValue<string>;
};

type CreateCompanyPhoneNumberRequest = {
  intlPrefix: OptionalValue<string>;
  regionCode: OptionalValue<string>;
  number: OptionalValue<string>;
};

type CreateCompanyMemberRequest = {
  contactId: OptionalValue<string>;
  title: OptionalValue<string>;
  percentage: OptionalValue<number>;
  memberSince: OptionalValue<string>;
};

export class CreateCompanyCommand {
  private constructor(
    public readonly company: Company,
    public readonly files: { [key in SUPPORTED_COMPANY_FILES]: BufferFile[] },
    public readonly note: Nullable<Note>,
  ) {}

  static create(
    id: OptionalValue<string>,
    companyName: OptionalValue<string>,
    dba: OptionalValue<string>,
    taxId: OptionalValue<string>,
    industry: OptionalValue<string>,
    service: OptionalValue<string>,
    creationDate: OptionalValue<string>,
    entityType: OptionalValue<string>,
    phoneNumbers: OptionalValue<CreateCompanyPhoneNumberRequest[]>,
    emails: OptionalValue<string[]>,
    address: OptionalValue<CreateCompanyAddressRequest>,
    members: OptionalValue<CreateCompanyMemberRequest[]>,
    files: OptionalValue<Record<string, Express.Multer.File[]>>,
    note: OptionalValue<{
      id?: OptionalValue<string>;
      description?: OptionalValue<string>;
      level?: OptionalValue<string>;
    }>,
    createdBy: Nullable<Id>,
  ): Result<CreateCompanyCommand> {
    return Result.combine([
      // id
      Id.create(
        id,
        () => DomainErrorCode.COMPANY_ID_EMPTY,
        () => DomainErrorCode.COMPANY_ID_INVALID,
      ),
      // companyName
      Company.validateCompanyName(companyName),
      // dba
      Company.validateDba(dba),
      // taxId
      TaxId.create(taxId),
      // industry
      Industry.create(industry),
      // industry
      Company.validateService(service),
      // creationDate
      Company.validateCreationDate(creationDate).map(() => creationDate),
      // entityType
      Company.validateEntityType(entityType),
      // address
      Address.create(
        address?.addressLine1,
        address?.addressLine2,
        address?.state,
        address?.city,
        address?.zipCode,
        address?.countryIsoCode2,
      ),
      // Phones
      Company.validatePhoneNumbers(phoneNumbers).flatMap((phoneNumbers) =>
        Result.combine(
          phoneNumbers.flatMap((phone) => Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number)),
        ),
      ),
      // Emails
      Company.validateEmails(emails).flatMap((emails) =>
        Result.combine(emails.flatMap((email) => Email.createUnverified(email))),
      ),
      // members
      Validator.of(members)
        .required(() => DomainErrorCode.COMPANY_MEMBERS_EMPTY)
        .array(() => DomainErrorCode.COMPANY_MEMBERS_INVALID)
        .notEmpty(() => DomainErrorCode.COMPANY_MEMBERS_EMPTY)
        .flatMap((members) =>
          Result.combine(
            members?.map((member) =>
              Id.create(
                member.contactId,
                () => DomainErrorCode.COMPANY_MEMBER_ID_EMPTY,
                () => DomainErrorCode.COMPANY_MEMBER_ID_INVALID,
              ).flatMap((contactId) =>
                CompanyMember.create(contactId, member?.title, member?.percentage, member?.memberSince),
              ),
            ),
          ),
        )
        .flatMap((members) => Company.validateMembersAndCheckRules(members)),
    ])
      .flatMap((params) => {
        const [
          id,
          companyName,
          dba,
          taxId,
          industry,
          service,
          creationDate,
          entityType,
          address,
          phones,
          emails,
          members,
        ] = params;
        return Company.create(
          id as Id,
          companyName as string,
          dba as string,
          taxId as TaxId,
          industry as Industry,
          service as string,
          creationDate as string,
          entityType as ENTITY_TYPE,
          address as Address,
          phones as Phone[],
          emails as Email[],
          members as CompanyMember[],
          createdBy,
        );
      })
      .flatMap((company) =>
        Result.combine([
          Result.ok(company),
          CreateCompanyCommand.mapFiles(files, company.id),
          note !== undefined
            ? Id.create(
                note?.id,
                () => DomainErrorCode.NOTE_ID_EMPTY,
                () => DomainErrorCode.NOTE_ID_INVALID,
              ).flatMap((noteId) => Note.create(noteId, company.createdBy!, note?.level, note?.description))
            : Result.ok(null),
        ]),
      )
      .map(([company, files, note]) => new CreateCompanyCommand(company, files, note));
  }

  private static mapFiles(
    files: OptionalValue<Record<string, Express.Multer.File[]>>,
    companyId: Id,
  ): Result<{ [key in SUPPORTED_COMPANY_FILES]: BufferFile[] }> {
    return Validator.of(files)
      .object(() => DomainErrorCode.COMPANY_DOCUMENTS_INVALID)
      .mapIfAbsent(() => ({}))
      .map((files) => Object.keys(files as object))
      .flatMap((keys) =>
        Result.combine(
          keys.map((key) =>
            Validator.of(key)
              .required(() => DomainErrorCode.COMPANY_FILE_TYPE_INVALID)
              .enum(SUPPORTED_COMPANY_FILES, () => DomainErrorCode.COMPANY_FILE_TYPE_INVALID),
          ),
        ),
      )
      .map(() => files as Record<string, Express.Multer.File[]>)
      .flatMap((files) => {
        const typedFiles: Partial<{ [key in SUPPORTED_COMPANY_FILES]: BufferFile[] }> = {};

        // Initialize all types with empty arrays
        Object.values(SUPPORTED_COMPANY_FILES).forEach((type) => {
          typedFiles[type] = [];
        });

        const fileResults: Result<void>[] = [];

        Object.entries(files).forEach(([type, fileList]) => {
          const documentType = type as SUPPORTED_COMPANY_FILES;
          fileResults.push(
            Result.combine(
              fileList.map((file) =>
                Validator.of(file)
                  .required(() => DomainErrorCode.FILE_PATH_EMPTY)
                  .map(
                    (file) =>
                      new BufferFile(
                        `${companyId.toString()}/${normalizeFileName(
                          Buffer.from(file.originalname, 'latin1').toString('utf8'),
                        )}`,
                        file.buffer,
                        extname(file.originalname),
                        file.mimetype,
                      ),
                  ),
              ),
            ).map((bufferFiles) => {
              typedFiles[documentType] = bufferFiles as BufferFile[];
            }),
          );
        });

        return Result.combine(fileResults).map(() => typedFiles as { [key in SUPPORTED_COMPANY_FILES]: BufferFile[] });
      });
  }
}
