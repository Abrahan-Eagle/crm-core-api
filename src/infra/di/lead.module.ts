import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InjectionConstant } from '@/app/common';
import { LeadCommandHandlers, LeadEventsHandlers, LeadQueryHandlers } from '@/app/lead';

import { LeadGroupSchema, LeadMappers, LeadResources, MongoLeadsRepository, ProspectSchema } from '../adapters';
import { UserModule } from './user.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InjectionConstant.LEAD_MODEL, schema: LeadGroupSchema },
      { name: InjectionConstant.PROSPECT_MODEL, schema: ProspectSchema },
    ]),
    UserModule,
  ],
  controllers: [...LeadResources],
  providers: [
    ...LeadEventsHandlers,
    ...LeadMappers,
    ...LeadCommandHandlers,
    ...LeadQueryHandlers,
    { provide: InjectionConstant.LEAD_REPOSITORY, useClass: MongoLeadsRepository },
  ],
  exports: [InjectionConstant.LEAD_REPOSITORY],
})
export class LeadModule {}
