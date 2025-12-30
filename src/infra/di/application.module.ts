import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ApplicationCommandHandlers,
  ApplicationEventsHandlers,
  ApplicationQueryHandlers,
  ApplicationServices,
} from '@/app/application';
import { InjectionConstant } from '@/app/common';
import {
  ApplicationResources,
  DraftApplicationSchema,
  MongoDraftApplicationRepository,
  WebhookApplicationResources,
} from '@/infra/adapters';

import { ApplicationMappers, ApplicationSchema, MongoApplicationRepository } from '../adapters';
import { BankModule } from './bank.module';
import { CommissionModule } from './commision.module';
import { CompanyModule } from './company.module';
import { ContactModule } from './contact.module';
import { UserModule } from './user.module';

@Global()
@Module({
  imports: [
    CompanyModule,
    BankModule,
    ContactModule,
    CommissionModule,
    UserModule,
    MongooseModule.forFeature([
      { name: InjectionConstant.APPLICATION_MODEL, schema: ApplicationSchema },
      { name: InjectionConstant.DRAFT_APPLICATION_MODEL, schema: DraftApplicationSchema },
    ]),
  ],
  controllers: [...ApplicationResources, ...WebhookApplicationResources],
  providers: [
    ...ApplicationServices,
    ...ApplicationEventsHandlers,
    ...ApplicationQueryHandlers,
    ...ApplicationCommandHandlers,
    ...ApplicationMappers,
    { provide: InjectionConstant.APPLICATION_REPOSITORY, useClass: MongoApplicationRepository },
    { provide: InjectionConstant.DRAFT_APPLICATION_REPOSITORY, useClass: MongoDraftApplicationRepository },
  ],
  exports: [MongooseModule],
})
export class ApplicationModule {}
