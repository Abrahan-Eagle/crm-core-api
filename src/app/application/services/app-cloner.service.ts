import { NotFound, Phone, Result, throwIfVoid, validateIf } from '@internal/common';
import { IdService, MongoConstant } from '@internal/mongo';
import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { join } from 'path';
import { PDFDocument, PDFForm } from 'pdf-lib';
import { delayWhen, forkJoin, iif, map, mergeMap, Observable, of, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant, TenantConfig } from '@/app/common';
import { Application, FilledApplicationDocument } from '@/domain/application';
import { BufferFile, Id } from '@/domain/common';
import { normalizeFileName } from '@/domain/common/utils';
import { Company, CompanyRepository } from '@/domain/company';
import { Contact, ContactRepository } from '@/domain/contact';
import { StorageRepository } from '@/domain/media';

import { AddressResolver } from './address-resolver.service';

@Injectable()
export class AppClonerService {
  constructor(
    private readonly tenantConfig: TenantConfig,
    @Inject(MongoConstant.ID_SERVICE)
    private readonly idService: IdService,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    private readonly addressResolver: AddressResolver,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
  ) {}

  public cloneForAllTenants(app: Application): Observable<{ application: Application; tenant: string }[]> {
    return of(this.tenantConfig.tenants.map((tenant) => tenant.id)).pipe(
      mergeMap((ids) =>
        forkJoin({
          tenants: of(ids),
          apps: of(ids).pipe(
            map((ids) =>
              Result.combine(
                ids.map((_, index) => app.clone(index === 0 ? app.id : this.idService.generate())),
              ).getOrThrow(),
            ),
          ),
          company: this.getCompanyAndMembers(app.companyId),
          signature: this.getSignature(app.signatureUrl),
        }),
      ),
      delayWhen<{
        tenants: string[];
        apps: Application[];
        company: { company: Company; members: Contact[] };
        signature: Uint8Array | null;
      }>(({ tenants, apps, company, signature }) =>
        zip(
          tenants.map((tenant, index) =>
            of(apps[index]).pipe(
              mergeMap((app) => this.generateFilledApp(tenant, app.id, company, signature)),
              tap((filledApp) =>
                apps[index].setFilledApplication([
                  FilledApplicationDocument.create(
                    apps[index].id.toString(),
                    normalizeFileName(`App ${company.company.companyName}.pdf`),
                    filledApp,
                  ).getOrThrow(),
                ]),
              ),
            ),
          ),
        ),
      ),
      map(({ apps }) =>
        apps.map((application, index) => ({ application, tenant: this.tenantConfig.tenants[index].id })),
      ),
    );
  }

  private generateFilledApp(
    tenantId: string,
    applicationId: Id,
    company: { company: Company; members: Contact[] },
    signature: Uint8Array | null,
  ): Observable<BufferFile> {
    return of(fs.readFileSync(join(process.cwd(), `./assets/fillable-pdf/${tenantId}.pdf`))).pipe(
      mergeMap((file) => PDFDocument.load(file)),
      delayWhen((pdf) =>
        iif(
          () => signature != null,
          of(pdf).pipe(
            mergeMap((pdf) =>
              forkJoin({
                image: pdf.embedPng(signature!),
                page: of(pdf.getPages().at(0)!),
                signPosition: of(
                  JSON.parse(
                    fs.readFileSync(join(process.cwd(), `./assets/fillable-pdf/${tenantId}.json`)).toString('utf-8'),
                  ) as {
                    signature: {
                      x: number;
                      y: number;
                    };
                  },
                ),
              }),
            ),
            map(({ image, page, signPosition }) => {
              const scale = Math.min(200 / image.width, 40 / image.height);

              page.drawImage(image, {
                x: signPosition.signature.x,
                y: signPosition.signature.y,
                width: image.width * scale,
                height: image.height * scale,
              });
            }),
          ),
          of(pdf),
        ),
      ),
      mergeMap((pdf) => of({ form: pdf.getForm(), pdf })),
      delayWhen(({ form }) => this.fillPDFFields(company, form, signature !== null)),
      mergeMap(({ pdf }) =>
        pdf.save().catch((e) => {
          console.log({
            tenantId,
            applicationId,
            signature,
          });
          console.log(e);
          throw e;
        }),
      ),
      tap(() => console.log('Reach here')),
      map((value) => Buffer.from(value)),
      map((buffer) => {
        return new BufferFile(
          `${applicationId.toString()}/${normalizeFileName(
            Buffer.from(`App ${company.company.companyName}.pdf`, 'latin1').toString('utf8'),
          )}`,
          buffer,
          '.pdf',
          'application/pdf',
        );
      }),
    );
  }

  private getCompanyAndMembers(companyId: Id): Observable<{ company: Company; members: Contact[] }> {
    return this.companyRepository.findById(companyId).pipe(
      throwIfVoid(() => NotFound.of(Company, companyId.toString())),
      mergeMap((company) =>
        forkJoin({
          company: of(company),
          members: this.contactRepository.findMany(company.members.map((member) => member.contactId)).pipe(
            validateIf(
              (contacts) => contacts.length === company.members.length,
              () => NotFound.of(Contact, ''),
            ),
          ),
        }),
      ),
    );
  }

  private async fillPDFFields(
    company: { company: Company; members: Contact[] },
    form: PDFForm,
    excludeSign: boolean,
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    this.safeSetField(form, 'company_name', company.company.companyName);
    if (company.company.dba) this.safeSetField(form, 'dba', company.company.dba);
    // Revisar la fecha de cumpleaños

    this.safeSetField(form, 'industry', company.company.industry.name);
    this.safeSetField(form, 'company_service', company.company.service);
    this.safeSetField(form, 'company_type_of_business', company.company.industry.name);
    const companyAddress = await this.addressResolver.resolve(company.company.address);

    // Convert to text
    this.safeSetField(form, 'inc_state', companyAddress.state ?? '');
    // Convert to text
    this.safeSetField(form, 'state', companyAddress.state ?? '');
    // Convert to text
    this.safeSetField(form, 'city', companyAddress.city ?? '');
    this.safeSetField(form, 'zip_code', companyAddress.zip_code ?? '');
    // Format address
    this.safeSetField(form, 'business_address', companyAddress.address ?? '');
    this.safeSetField(form, 'tax_id', company.company.taxId.toString());
    // Convert to text
    this.safeSetField(form, 'company_type_of_entity', company.company.entityType);
    // Format Date
    this.safeSetField(form, 'company_creation_date', company.company.creationDate.toISOString().split('T')[0]);
    // this.safeSetField(form, 'company_phone', this.formatPhone(company.company.phoneNumbers[0]));

    const memberOne = company.company.members.at(0);
    if (memberOne) {
      const contactOne = company.members.find((item) => item.id.equals(memberOne.contactId));
      if (contactOne) {
        const contactOneAddress = await this.addressResolver.resolve(contactOne.address);

        this.safeSetField(form, 'member_1_full_name', `${contactOne.firstName} ${contactOne.lastName}`);
        this.safeSetField(form, 'member_1_ownership', memberOne.percentage.toString());
        // Format Date
        this.safeSetField(form, 'member_1_member_since', memberOne.memberSince.toISOString().split('T')[0]);
        this.safeSetField(form, 'member_1_title', memberOne.title);
        this.safeSetField(form, 'member_1_address', contactOneAddress.address ?? '');
        this.safeSetField(form, 'member_1_city', contactOneAddress.city ?? '');
        this.safeSetField(form, 'member_1_state', contactOneAddress.state ?? '');
        this.safeSetField(form, 'member_1_zip_code', contactOneAddress.zip_code ?? '');
        // Format Date
        this.safeSetField(form, 'member_1_birthdate', contactOne.birthdate.toISOString().split('T')[0]);
        this.safeSetField(form, 'member_1_ssn', contactOne.ssn);
        if (!excludeSign) {
          this.safeSetField(form, 'member_1_sign', contactOne.firstName);
        }
        this.safeSetField(form, 'member_1_sign_date', today);
      }
    }

    const memberTwo = company.company.members.at(1);
    if (memberTwo) {
      const contactTwo = company.members.find((item) => item.id.equals(memberTwo.contactId));
      if (contactTwo) {
        const contactTwoAddress = await this.addressResolver.resolve(contactTwo.address);

        this.safeSetField(form, 'member_2_full_name', `${contactTwo.firstName} ${contactTwo.lastName}`);
        this.safeSetField(form, 'member_2_ownership', (100 - memberOne!.percentage).toString());
        // Format Date
        this.safeSetField(form, 'member_2_member_since', memberTwo.memberSince.toISOString().split('T')[0]);
        this.safeSetField(form, 'member_2_title', memberTwo.title);
        this.safeSetField(form, 'member_2_address', contactTwoAddress.address ?? '');
        this.safeSetField(form, 'member_2_city', contactTwoAddress.city ?? '');
        this.safeSetField(form, 'member_2_state', contactTwoAddress.state ?? '');
        this.safeSetField(form, 'member_2_zip_code', contactTwoAddress.zip_code ?? '');
        // Format Date
        this.safeSetField(form, 'member_2_birthdate', contactTwo.birthdate.toISOString().split('T')[0]);
        this.safeSetField(form, 'member_2_ssn', contactTwo.ssn);
        this.safeSetField(form, 'member_2_sign', contactTwo.firstName);
        this.safeSetField(form, 'member_2_sign_date', today);
      }
    }
  }

  private safeSetField(form: any, field: string, value: string | null): void {
    try {
      form.getTextField(field).setText(value!.replace(/\u202F/g, '-'));
    } catch (e) {
      // Safe to ignore
    }
  }

  private getSignature(signature: string | null): Observable<Uint8Array | null> {
    if (!signature) {
      return of({}).pipe(map(() => null));
    }

    return this.storage.getFile(signature, ENTITY_MEDIA_TYPE.APPLICATION);
  }

  private formatPhone(phone?: Phone): string {
    if (!phone) return '';

    try {
      const number = parsePhoneNumber(phone.number, phone.regionCode as CountryCode);
      return number.formatInternational();
    } catch (error) {
      return '';
    }
  }
}
