import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InjectionConstant } from '@/app/common';
import { UserCommandHandlers, UserQueryHandlers } from '@/app/user';
import {
  CloudTalkVoIPProviderRepository,
  MongoUserRepository,
  UserMappers,
  UserResources,
  UserSchema,
} from '@/infra/adapters';

@Module({
  imports: [MongooseModule.forFeature([{ name: InjectionConstant.USER_MODEL, schema: UserSchema }]), HttpModule],
  controllers: [...UserResources],
  providers: [
    ...UserCommandHandlers,
    ...UserQueryHandlers,
    ...UserMappers,
    { provide: InjectionConstant.USER_REPOSITORY, useClass: MongoUserRepository },
    { provide: InjectionConstant.VOIP_PROVIDER_REPOSITORY, useClass: CloudTalkVoIPProviderRepository },
  ],
  exports: [InjectionConstant.USER_REPOSITORY],
})
export class UserModule {}
