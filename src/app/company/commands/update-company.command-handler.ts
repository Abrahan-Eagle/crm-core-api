import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { CompanyRepository, UpdateCompanyCommand } from '@/domain/company';
import { Company } from '@/domain/company/entities';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyCommandHandler extends BaseCommandHandler<UpdateCompanyCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly repository: CompanyRepository,
  ) {
    super();
  }

  handle(command: UpdateCompanyCommand): Observable<void> {
    const { companyId } = command;
    return this.repository.findById(companyId).pipe(
      throwIfVoid(() => NotFound.of(Company, companyId.toString())),
      tap<Company>((company) => company.updateCompany(command).getOrThrow()),
      mergeMap((company) => this.repository.updateOne(company)),
      mapToVoid(),
    );
  }
}
