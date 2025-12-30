import { BadRequest, OptionalValue, Result, validateIf } from '@internal/common';
import xlsx from 'read-excel-file/node';
import { from, map, Observable } from 'rxjs';

import { DomainErrorCode, Id } from '@/domain/common';

import { Campaign, CampaignContact } from '../entities';

export class CreateCampaignCommand {
  private constructor(
    public readonly contacts: CampaignContact[],
    public readonly campaign: Campaign,
  ) {}

  public static create(
    id: OptionalValue<string>,
    sender: OptionalValue<string>,
    subject: OptionalValue<string>,
    message: OptionalValue<string>,
    file: OptionalValue<Express.Multer.File>,
  ): Observable<Result<CreateCampaignCommand>> {
    return from(xlsx(file!.buffer)).pipe(
      validateIf(
        (row) =>
          row[0][0].toString().trim().toLowerCase() === 'name' && row[0][1].toString().trim().toLowerCase() === 'email',
        () => new BadRequest(DomainErrorCode.CAMPAIGN_FILE_HEADERS_MALFORMED),
      ),
      map((rows) =>
        Result.combine([
          Id.create(
            id,
            () => DomainErrorCode.CAMPAIGN_ID_EMPTY,
            () => DomainErrorCode.CAMPAIGN_ID_INVALID,
          ),
          Result.ok(rows),
        ]).getOrThrow(),
      ),
      map(([campaignId, rows]) => {
        const contacts: CampaignContact[] = [];

        for (let index = 0; index < rows.length; index++) {
          // Skip headers
          if (index === 0) {
            continue;
          }

          const [name, email] = rows[index];

          if (!(email?.toString()?.trim()?.toLowerCase() || '')) {
            continue;
          }

          const contactResult = CampaignContact.create(
            Id.empty(),
            campaignId,
            email?.toString()?.trim()?.toLowerCase() ?? '',
            name?.toString()?.trim() ?? '',
            '',
          );

          if (contactResult.isFailure()) {
            continue;
          }

          contacts.push(contactResult.getOrThrow());
        }

        return { contacts, campaignId };
      }),
      validateIf(
        ({ contacts }) => contacts.length > 0,
        () => new BadRequest(DomainErrorCode.CAMPAIGN_NO_CONTACTS),
      ),
      map(({ contacts, campaignId }) =>
        Result.combine([
          Result.ok(contacts),
          Campaign.create(campaignId, sender, subject, message, contacts.length),
        ]).getOrThrow(),
      ),
      map((params) => Result.ok(new CreateCampaignCommand(...params))),
    );
  }
}
