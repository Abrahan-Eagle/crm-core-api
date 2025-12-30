import { CampaignComplaintCommandHandler } from './campaign-complaint.command-handler';
import { CreateCampaignCommandHandler } from './create-campaign.command-handler';
import { SendNextEmailFromCampaignCommandHandler } from './send-next-email-from-campaign.command-handler';
import { StartCampaignCommandHandler } from './start-campaign.command-handler';
import { StopAllCampaignsCommandHandler } from './stop-all-campaigns.command-handler';
import { StopCampaignCommandHandler } from './stop-campaign.command-handler';

export const CampaignCommandHandlers = [
  CampaignComplaintCommandHandler,
  CreateCampaignCommandHandler,
  SendNextEmailFromCampaignCommandHandler,
  StartCampaignCommandHandler,
  StopAllCampaignsCommandHandler,
  StopCampaignCommandHandler,
];
