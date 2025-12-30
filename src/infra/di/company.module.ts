import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InjectionConstant } from '@/app/common';
import { CompanyCommandHandlers, CompanyQueryHandlers } from '@/app/company';
import {
  CompanyMappers,
  CompanyResources,
  CompanySchema,
  ContactMappers,
  MongoCompanyRepository,
} from '@/infra/adapters';

import { ContactModule } from './contact.module';
import { UserModule } from './user.module';

@Global()
@Module({
  imports: [
    UserModule,
    ContactModule,
    MongooseModule.forFeature([{ name: InjectionConstant.COMPANY_MODEL, schema: CompanySchema }]),
  ],
  controllers: [...CompanyResources],
  providers: [
    ...CompanyCommandHandlers,
    ...CompanyQueryHandlers,
    ...CompanyMappers,
    ...ContactMappers,
    { provide: InjectionConstant.COMPANY_REPOSITORY, useClass: MongoCompanyRepository },
  ],
  exports: [InjectionConstant.COMPANY_REPOSITORY],
})
export class CompanyModule {}
