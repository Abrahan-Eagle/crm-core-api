import {
  BaseCommandHandler,
  CommandHandler,
  CommonConstant,
  EventDispatcher,
  mapToVoid,
  NotFound,
  Nullable,
  Phone,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, map, mergeMap, Observable, switchMap, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Bank, BankRepository } from '@/domain/bank';
import { Id } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';
import { Contact, ContactRepository } from '@/domain/contact';
import { LeadsRepository, Prospect, ProspectCalledEvent } from '@/domain/leads';
import { CALL_ENTITY_TYPE, MakeACallCommand, User, UserRepository, VoIPProviderRepository } from '@/domain/user';

@CommandHandler(MakeACallCommand)
export class MakeACallCommandHandler extends BaseCommandHandler<MakeACallCommand, void> {
  constructor(
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionConstant.CONTACT_REPOSITORY)
    private readonly contactRepository: ContactRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(InjectionConstant.LEAD_REPOSITORY)
    private readonly leadRepository: LeadsRepository,
    @Inject(InjectionConstant.VOIP_PROVIDER_REPOSITORY)
    private readonly voIPProvider: VoIPProviderRepository,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
  ) {
    super();
  }

  handle(command: MakeACallCommand): Observable<void> {
    const { request } = command;
    return this.userRepository.findById(request.userId).pipe(
      throwIfVoid(() => NotFound.of(User, request.userId.toString())),
      switchMap((user) => {
        switch (request.entityType) {
          case CALL_ENTITY_TYPE.CONTACT:
            return this.getPhoneFromContact(request.entityId, request.phoneIndex).pipe(
              map((phone) => ({ phone, user })),
            );
          case CALL_ENTITY_TYPE.BANK:
            return this.getPhoneFromBank(request.entityId, request.phoneIndex).pipe(map((phone) => ({ phone, user })));
          case CALL_ENTITY_TYPE.COMPANY:
            return this.getPhoneFromCompany(request.entityId, request.phoneIndex).pipe(
              map((phone) => ({ phone, user })),
            );
          case CALL_ENTITY_TYPE.PROSPECT:
            return this.getProspectById(request.entityId).pipe(map((phone) => ({ phone, user })));
        }
      }),
      validateIf(
        ({ phone }) => phone !== null,
        () => NotFound.of(Phone, request.phoneIndex.toString()),
      ),

      delayWhen(({ user, phone }) =>
        this.voIPProvider.getAgentIdFromEmail(user.email).pipe(
          throwIfVoid(() => NotFound.of(User, user.email.toString())),
          mergeMap((agentId) => this.voIPProvider.makeACall(phone!, agentId)),
        ),
      ),
      mapToVoid(),
      tap(
        () =>
          request.entityType === CALL_ENTITY_TYPE.PROSPECT &&
          this.dispatcher.dispatchEventsAsync([
            new ProspectCalledEvent(request.userId.toString(), request.entityId.toString(), new Date()),
          ]),
      ),
    );
  }

  private getPhoneFromContact(contactId: Id, index: number): Observable<Nullable<Phone>> {
    return this.contactRepository.findById(contactId).pipe(
      throwIfVoid<Contact>(() => NotFound.of(Contact, contactId.toString())),
      map((contact) => contact.phones.at(index) || null),
    );
  }

  private getPhoneFromBank(bankId: Id, index: number): Observable<Nullable<Phone>> {
    return this.bankRepository.findById(bankId).pipe(
      throwIfVoid<Bank>(() => NotFound.of(Bank, bankId.toString())),
      map(
        (bank) =>
          bank.contacts
            .map((contact) => contact.phones)
            .flat()
            .at(index) || null,
      ),
    );
  }

  private getPhoneFromCompany(companyId: Id, index: number): Observable<Nullable<Phone>> {
    return this.companyRepository.findById(companyId).pipe(
      throwIfVoid<Company>(() => NotFound.of(Company, companyId.toString())),
      map((company) => company.phoneNumbers.at(index) || null),
    );
  }

  private getProspectById(prospectId: Id): Observable<Nullable<Phone>> {
    return this.leadRepository.getProspectById(prospectId).pipe(
      throwIfVoid<Prospect>(() => NotFound.of(Prospect, prospectId.toString())),
      map((prospect) => prospect.phone),
    );
  }
}
