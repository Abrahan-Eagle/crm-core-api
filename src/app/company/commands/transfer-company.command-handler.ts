import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { forkJoin, mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Id } from '@/domain/common';
import { Company, CompanyRepository, TransferCompanyCommand } from '@/domain/company';
import { User, UserRepository } from '@/domain/user';

@CommandHandler(TransferCompanyCommand)
export class TransferCompanyCommandHandler extends BaseCommandHandler<TransferCompanyCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  handle(command: TransferCompanyCommand): Observable<void> {
    const { companyId, userId } = command;
    return forkJoin({
      company: this._getCompany(companyId),
      user: this._getUser(userId),
    }).pipe(
      tap(({ company, user }) => company.transfer(user.id).getOrThrow()),
      mergeMap(({ company }) => this.companyRepository.updateOne(company)),
    );
  }

  private _getCompany(companyId: Id): Observable<Company> {
    return this.companyRepository
      .findById(companyId)
      .pipe(throwIfVoid<Company>(() => NotFound.of(Company, companyId.toString())));
  }

  private _getUser(userId: Id): Observable<User> {
    return this.userRepository.findById(userId).pipe(
      throwIfVoid<User>(() => NotFound.of(User, userId.toString())),
      validateIf(
        (user) => user.isActive(),
        () => NotFound.of(User, userId.toString()),
      ),
    );
  }
}
