import { CampaignComplaintResource } from './campaign-complaint.resource';
import { CreateCampaignResource } from './create-campaign.resource';
import { GetCampaignsResource } from './get-campaigns.resource';
import { SendNextEmailFromCampaignResource } from './send-next-email-from-campaign.resource';
import { StartCampaignResource } from './start-campaign.resource';
import { StopAllCampaignsResource } from './stop-all-campaigns.resource';
import { StopCampaignResource } from './stop-campaign.resource';

export const CampaignResources = [
  CampaignComplaintResource,
  CreateCampaignResource,
  GetCampaignsResource,
  SendNextEmailFromCampaignResource,
  StartCampaignResource,
  StopCampaignResource,
  StopAllCampaignsResource,
];
