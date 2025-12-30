import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BankCommandHandlers } from '@/app/bank';
import { BankQueryHandlers } from '@/app/bank/queries';
import { InjectionConstant } from '@/app/common';
import { BankMappers, BankResources, BankSchema, MongoBankRepository } from '@/infra/adapters';

import { ApplicationModule } from './application.module';

@Global()
@Module({
  imports: [
    forwardRef(() => ApplicationModule),
    MongooseModule.forFeature([{ name: InjectionConstant.BANK_MODEL, schema: BankSchema }]),
  ],
  controllers: [...BankResources],
  providers: [
    ...BankCommandHandlers,
    ...BankQueryHandlers,
    ...BankMappers,
    { provide: InjectionConstant.BANK_REPOSITORY, useClass: MongoBankRepository },
  ],
  exports: [InjectionConstant.BANK_REPOSITORY, MongooseModule],
})
export class BankModule {}
