import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CampaignCommandHandlers, CampaignQueryHandlers } from '@/app/campaign';
import { InjectionConstant } from '@/app/common';

import {
  CampaignContactSchema,
  CampaignMappers,
  CampaignResources,
  CampaignSchema,
  ComplaintSchema,
  MongoCampaignRepository,
} from '../adapters';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InjectionConstant.CAMPAIGN_MODEL, schema: CampaignSchema },
      { name: InjectionConstant.COMPLAINT_MODEL, schema: ComplaintSchema },
      { name: InjectionConstant.CAMPAIGN_CONTACT_MODEL, schema: CampaignContactSchema },
    ]),
  ],
  controllers: [...CampaignResources],
  providers: [
    ...CampaignCommandHandlers,
    ...CampaignQueryHandlers,
    ...CampaignMappers,
    { provide: InjectionConstant.CAMPAIGN_REPOSITORY, useClass: MongoCampaignRepository },
  ],
})
export class CampaignModule {}
