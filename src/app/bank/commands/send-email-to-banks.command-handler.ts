import { BaseCommandHandler, CommandHandler, NotFound, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig, TenantConfig } from '@/app/common';
import { AttachmentData, Bank, BankRepository, SendEmailToBanksCommand } from '@/domain/bank';
import { EmailRequest, Id, InvalidTenantId, MailerService, UrlSignerService } from '@/domain/common';
import { Company, CompanyDocument, CompanyRepository } from '@/domain/company';
import { Contact, ContactDocument, ContactRepository } from '@/domain/contact';
import { ExtendedAuthContextStorage } from '@/infra/common';

@CommandHandler(SendEmailToBanksCommand)
export class SendEmailToBanksCommandHandler extends BaseCommandHandler<SendEmailToBanksCommand, void> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionConstant.MAILER_SERVICE)
    private readonly mailer: MailerService,
    private readonly mediaConfig: MediaConfig,
    private readonly tenantConfig: TenantConfig,
    private readonly context: ExtendedAuthContextStorage,
    @Inject(InjectionConstant.URL_SIGNER_SERVICE)
    private readonly signer: UrlSignerService,
  ) {
    super();
  }

  handle(command: SendEmailToBanksCommand): Observable<void> {
    const { bankIds: banksIds, subject, message, attachments } = command;

    return forkJoin({
      banks: this.getBanks(banksIds),
      attachments: this.getAttachments(attachments),
    }).pipe(
      map(({ banks, attachments }) =>
        this._buildEmailRequest(subject, message, attachments, this._extractBankEmails(banks)),
      ),
      mergeMap((emailRequest) => this.mailer.send(emailRequest)),
    );
  }

  private getBanks(ids: Id[]): Observable<Bank[]> {
    return this.bankRepository.findManyById(ids).pipe(
      validateIf(
        (banks) => ids.length === banks.length,
        (banks) => {
          const diff = new Set(banks.map((bank) => bank.id.toString()));
          return NotFound.of(
            Bank,
            ids
              .filter((id) => !diff.has(id.toString()))
              .at(0)
              ?.toString() ?? '',
          );
        },
      ),
    );
  }

  private getAttachments(attachments: AttachmentData[]): Observable<string[]> {
    const contactAttachments: AttachmentData[] = [];
    const companyAttachments: AttachmentData[] = [];

    for (const attachment of attachments) {
      if (attachment.entityType === ENTITY_MEDIA_TYPE.CONTACT) {
        contactAttachments.push(attachment);
      } else if (attachment.entityType === ENTITY_MEDIA_TYPE.COMPANY) {
        companyAttachments.push(attachment);
      }
    }

    return forkJoin({
      contactUrls: this._getContactAttachments(contactAttachments),
      companyUrls: this._getCompanyAttachments(companyAttachments),
    }).pipe(map(({ contactUrls, companyUrls }) => [...contactUrls, ...companyUrls]));
  }

  private _getContactAttachments(attachments: AttachmentData[]): Observable<string[]> {
    if (attachments.length === 0) return of([]);

    return this.contactRepository.findMany(attachments.map((attachment) => attachment.entityId)).pipe(
      map((contacts) => {
        const contactMap = new Map(contacts.map((contact) => [contact.id.toString(), contact]));

        const urls: string[] = [];

        for (const attachment of attachments) {
          const contact = contactMap.get(attachment.entityId.toString());
          if (!contact) throw NotFound.of(Contact, attachment.entityId.toString());

          const document = contact.documents.find((doc) => doc.id.equals(attachment.documentId));
          if (!document) throw NotFound.of(ContactDocument, attachment.documentId.toString());

          const { uri: contactURI } = this.mediaConfig.getMediaConfig(ENTITY_MEDIA_TYPE.CONTACT);
          const signedUrl = this.signer.sign(`${contactURI}/${document.name}`);
          urls.push(signedUrl);
        }

        return urls;
      }),
    );
  }

  private _getCompanyAttachments(attachments: AttachmentData[]): Observable<string[]> {
    if (attachments.length === 0) return of([]);

    return this.companyRepository.findMany(attachments.map((attachment) => attachment.entityId)).pipe(
      map((companies) => {
        const companyMap = new Map(companies.map((company) => [company.id.toString(), company]));

        const urls: string[] = [];

        for (const attachment of attachments) {
          const company = companyMap.get(attachment.entityId.toString());
          if (!company) throw NotFound.of(Company, attachment.entityId.toString());

          const document = company.documents.find((doc) => doc.id.equals(attachment.documentId));
          if (!document) throw NotFound.of(CompanyDocument, attachment.documentId.toString());

          const { uri: companyURI } = this.mediaConfig.getMediaConfig(ENTITY_MEDIA_TYPE.COMPANY);
          const signedUrl = this.signer.sign(`${companyURI}/${document.name}`);
          urls.push(signedUrl);
        }

        return urls;
      }),
    );
  }

  private _extractBankEmails(banks: Bank[]): string[] {
    return banks.reduce<string[]>((emails, bank) => {
      bank.contacts.forEach((contact) => {
        contact.emails.forEach((email) => {
          emails.push(email.value);
        });
      });
      return emails;
    }, []);
  }

  private _buildEmailRequest(
    subject: string,
    message: string,
    attachments: string[],
    bankEmails: string[],
  ): EmailRequest {
    const tenant = this.tenantConfig.tenants.find((tenant) => tenant.id === this.context.store.tenantId);
    if (!tenant || !tenant.email) {
      throw new InvalidTenantId(this.context.store.tenantId);
    }

    return {
      from: tenant.email,
      subject,
      message,
      bcc: bankEmails,
      attachments: attachments,
    };
  }
}
