import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommissionCommandHandlers, CommissionQueryHandlers } from '@/app/commission';
import { InjectionConstant } from '@/app/common';

import { CommissionMappers, CommissionResources, CommissionSchema, MongoCommissionRepository } from '../adapters';
import { UserModule } from './user.module';

@Global()
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: InjectionConstant.COMMISSION_MODEL, schema: CommissionSchema }]),
  ],
  controllers: [...CommissionResources],
  providers: [
    ...CommissionCommandHandlers,
    ...CommissionQueryHandlers,
    ...CommissionMappers,
    { provide: InjectionConstant.COMMISSION_REPOSITORY, useClass: MongoCommissionRepository },
  ],
  exports: [InjectionConstant.COMMISSION_REPOSITORY],
})
export class CommissionModule {}
