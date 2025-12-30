import { OptionalValue, Result } from '@internal/common';

import { TaxId } from '@/domain/common';

export class GetCompanyByTaxIdQuery {
  private constructor(public readonly taxId: TaxId) {}

  static create(taxId: OptionalValue<string>): Result<GetCompanyByTaxIdQuery> {
    return TaxId.create(taxId).map((taxId) => new GetCompanyByTaxIdQuery(taxId));
  }
}
