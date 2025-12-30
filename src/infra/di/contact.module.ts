import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InjectionConstant } from '@/app/common';
import { ContactCommandHandlers, ContactQueryHandlers } from '@/app/contact';

import {
  ContactMappers,
  ContactResources,
  ContactSchema,
  MongoContactRepository,
  SystemeExternalContactsRepository,
} from '../adapters';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: InjectionConstant.CONTACT_MODEL, schema: ContactSchema }])],
  controllers: [...ContactResources],
  providers: [
    ...ContactQueryHandlers,
    ...ContactCommandHandlers,
    ...ContactMappers,
    { provide: InjectionConstant.CONTACT_REPOSITORY, useClass: MongoContactRepository },
    { provide: InjectionConstant.EXTERNAL_CONTACTS_REPOSITORY, useClass: SystemeExternalContactsRepository },
  ],
  exports: [InjectionConstant.CONTACT_REPOSITORY, InjectionConstant.EXTERNAL_CONTACTS_REPOSITORY],
})
export class ContactModule {}
