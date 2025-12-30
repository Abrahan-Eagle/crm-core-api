import { AddCompanyDocumentResource } from './add-company-document.resource';
import { AddCompanyNoteResource } from './add-company-note.resource';
import { CompaniesByContactIdResource } from './companies-of-contact.resource';
import { CreateCompanyResource } from './create-company.resource';
import { DeleteBankDocumentResource } from './delete-company-document.resource';
import { GetCompanyByIdResource } from './get-company-by-id.resource';
import { GetCompanyByTaxIdResource } from './get-company-by-tax-id.resource';
import { RemoveCompanyNoteResource } from './remove-company-note.resource';
import { SearchCompaniesResource } from './search-companies.resource';
import { TransferCompanyResource } from './transfer-company.resource';
import { UpdateCompanyResource } from './update-company.resource';

export const CompanyResources = [
  AddCompanyDocumentResource,
  AddCompanyNoteResource,
  CompaniesByContactIdResource,
  CreateCompanyResource,
  DeleteBankDocumentResource,
  GetCompanyByIdResource,
  GetCompanyByTaxIdResource,
  RemoveCompanyNoteResource,
  SearchCompaniesResource,
  TransferCompanyResource,
  UpdateCompanyResource,
];
