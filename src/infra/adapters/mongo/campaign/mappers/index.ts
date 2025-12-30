import { CampaignMapper } from './campaign.mapper';
import { CampaignContactMapper } from './campaign-contact.mapper';
import { ComplaintMapper } from './complaint.mapper';

export * from './campaign.mapper';
export * from './campaign-contact.mapper';
export * from './complaint.mapper';

export const CampaignMappers = [ComplaintMapper, CampaignMapper, CampaignContactMapper];
