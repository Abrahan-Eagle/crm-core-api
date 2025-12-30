import { BadRequest, OptionalValue, Phone, Result, validateIf } from '@internal/common';
import { parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';
import xlsx from 'read-excel-file/node';
import { from, map, Observable } from 'rxjs';

import { DomainErrorCode, Id } from '@/domain/common';

import { LeadGroup, Prospect } from '../entities';

export class CreateLeadCommand {
  private constructor(
    public readonly leadGroup: LeadGroup,
    public readonly prospects: Prospect[],
    public readonly skippedIndices: number[],
  ) {}

  static create(
    id: OptionalValue<string>,
    name: OptionalValue<string>,
    assignedTo: OptionalValue<string>,
    createdBy: OptionalValue<string>,
    file: OptionalValue<Express.Multer.File>,
  ): Observable<Result<CreateLeadCommand>> {
    return from(xlsx(file!.buffer)).pipe(
      validateIf(
        (row) =>
          row[0][0].toString().trim().toLowerCase() === 'company' &&
          row[0][1].toString().trim().toLowerCase() === 'name' &&
          row[0][2].toString().trim().toLowerCase() === 'email' &&
          row[0][3].toString().trim().toLowerCase() === 'phone',
        () => new BadRequest(DomainErrorCode.LEAD_FILE_HEADERS_MALFORMED),
      ),
      map((rows) =>
        Result.combine([
          Id.create(
            id,
            () => DomainErrorCode.LEAD_ID_EMPTY,
            () => DomainErrorCode.LEAD_ID_INVALID,
          ),
          Result.ok(rows),
        ]).getOrThrow(),
      ),
      map(([leadId, rows]) => {
        const valids: Prospect[] = [];
        const skippedIndices: number[] = [];

        for (let index = 0; index < rows.length; index++) {
          // Skip headers
          if (index === 0) {
            continue;
          }

          const [company, name, email, phone] = rows[index];
          if (!(name?.toString() ?? '') || !(phone?.toString() ?? '')) {
            skippedIndices.push(index);
            continue;
          }

          const prePhone = phone.toString().match(/\d+/g)?.join('') ?? '';

          let parsedPhone: PhoneNumber;
          try {
            parsedPhone = parsePhoneNumber(prePhone, 'US');

            if (!parsedPhone.isPossible()) {
              skippedIndices.push(index + 1);
              continue;
            }
          } catch (error) {
            skippedIndices.push(index + 1);
            continue;
          }

          const phoneResult = Phone.create(
            `+${parsedPhone.countryCallingCode}`,
            parsedPhone.country,
            parsedPhone.nationalNumber,
          );

          if (phoneResult.isFailure()) {
            skippedIndices.push(index + 1);
            continue;
          }

          const prospectResult = Prospect.create(
            Id.empty(),
            leadId,
            company?.toString() ?? '',
            name?.toString() ?? '',
            email?.toString() ?? null,
            phoneResult.getOrThrow(),
          );

          if (prospectResult.isFailure()) {
            skippedIndices.push(index);
            continue;
          }

          valids.push(prospectResult.getOrThrow());
        }

        return [valids, skippedIndices] as [Prospect[], number[]];
      }),
      map(([prospects, skipped]) =>
        Result.combine([
          Result.ok(prospects),
          Id.create(
            id,
            () => DomainErrorCode.LEAD_ID_EMPTY,
            () => DomainErrorCode.LEAD_ID_INVALID,
          ),
          Id.create(
            assignedTo,
            () => DomainErrorCode.LEAD_ASSIGNED_ID_EMPTY,
            () => DomainErrorCode.LEAD_ASSIGNED_ID_INVALID,
          ),
          Id.create(
            createdBy,
            () => DomainErrorCode.USER_ID_EMPTY,
            () => DomainErrorCode.USER_ID_INVALID,
          ),
          Result.ok(skipped),
        ]).getOrThrow(),
      ),
      map(([prospects, id, assignedTo, createdBy, skipped]) => ({
        lead: LeadGroup.create(id, name, prospects.length, assignedTo, createdBy).getOrThrow(),
        prospects,
        skipped,
      })),
      map(({ lead, prospects, skipped }) => Result.ok(new CreateLeadCommand(lead, prospects, skipped))),
    );
  }
}
