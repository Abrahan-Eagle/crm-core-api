import { CommissionMapper } from './commission.mapper';
import { CommissionDetailMapper } from './commission-detail.mapper';
import { DistributionMapper } from './distribution.mapper';

export * from './commission.mapper';

export const CommissionMappers = [CommissionMapper, CommissionDetailMapper, DistributionMapper];
