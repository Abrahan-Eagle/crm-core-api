import { GetCommissionIdResource } from './get-commission-by-id.resource';
import { PublishCommissionResource } from './publish-commission.resource';
import { SearchCommissionsResource } from './search-commissions.resource';
import { UpdateCommissionResource } from './update-commission.resource';

export const CommissionResources = [
  SearchCommissionsResource,
  PublishCommissionResource,
  GetCommissionIdResource,
  UpdateCommissionResource,
];
