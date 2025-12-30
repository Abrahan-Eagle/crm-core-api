import { S3Client } from '@aws-sdk/client-s3';
import {
  MongoConstant,
  MongoIdService,
  MongoTransactionContextStorage,
  MongoTransactionService,
} from '@internal/mongo';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagementClient } from 'auth0';

import {
  CommonEventsHandlers,
  CommonQueryHandlers,
  IdentityProviderConfig,
  InjectionConstant,
  MediaConfig,
} from '@/app/common';
import { DynamicRequestTransformationPipe, ExtendedAuthContextStorage, GlobalInterceptors } from '@/infra/common';

import {
  Auth0IdentityProviderRepository,
  AWSURLSignerService,
  CommonMappers,
  CommonResources,
  HttpDemographicsService,
  HttpSchedulerService,
  IndustrySchema,
  MongoIndustryRepository,
  NotificationAPIRepository,
  S3StorageRepository,
  SESMailerService,
  TenantConfigSchema,
} from '../adapters';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    MongooseModule.forFeature([
      { name: InjectionConstant.INDUSTRY_MODEL, schema: IndustrySchema },
      { name: InjectionConstant.TENANT_CONFIG_MODEL, schema: TenantConfigSchema },
    ]),
  ],
  controllers: [...CommonResources],
  providers: [
    ...CommonEventsHandlers,
    ...CommonQueryHandlers,
    ...CommonMappers,
    ExtendedAuthContextStorage,
    DynamicRequestTransformationPipe,
    { provide: MongoConstant.ID_SERVICE, useClass: MongoIdService },
    { provide: InjectionConstant.INDUSTRY_REPOSITORY, useClass: MongoIndustryRepository },
    { provide: InjectionConstant.STORAGE_REPOSITORY, useClass: S3StorageRepository },
    { provide: InjectionConstant.TRANSACTION_SERVICE, useClass: MongoTransactionService },
    { provide: InjectionConstant.SCHEDULER_SERVICE, useClass: HttpSchedulerService },
    { provide: InjectionConstant.DEMOGRAPHICS_SERVICE, useClass: HttpDemographicsService },
    { provide: InjectionConstant.MAILER_SERVICE, useClass: SESMailerService },
    { provide: InjectionConstant.URL_SIGNER_SERVICE, useClass: AWSURLSignerService },
    { provide: InjectionConstant.NOTIFICATION_REPOSITORY, useClass: NotificationAPIRepository },
    { provide: InjectionConstant.IDENTITY_PROVIDER_REPOSITORY, useClass: Auth0IdentityProviderRepository },
    {
      provide: S3Client,
      useFactory: async (config: MediaConfig) =>
        new S3Client({
          region: config.region,
          credentials: {
            accessKeyId: config.key,
            secretAccessKey: config.secret,
          },
        }),
      inject: [MediaConfig],
    },
    ...GlobalInterceptors.map((interceptor) => ({
      provide: APP_INTERCEPTOR,
      useClass: interceptor,
    })),
    MongoTransactionContextStorage,
    {
      scope: Scope.REQUEST,
      provide: ManagementClient,
      useFactory: (config: IdentityProviderConfig) =>
        new ManagementClient({
          domain: config.domain,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        }),
      inject: [IdentityProviderConfig],
    },
  ],
  exports: [
    MongooseModule,
    ExtendedAuthContextStorage,
    MongoConstant.ID_SERVICE,
    InjectionConstant.STORAGE_REPOSITORY,
    InjectionConstant.TRANSACTION_SERVICE,
    InjectionConstant.SCHEDULER_SERVICE,
    InjectionConstant.MAILER_SERVICE,
    InjectionConstant.URL_SIGNER_SERVICE,
    InjectionConstant.INDUSTRY_REPOSITORY,
    InjectionConstant.DEMOGRAPHICS_SERVICE,
    InjectionConstant.IDENTITY_PROVIDER_REPOSITORY,
    ...CommonMappers,
    MongoTransactionContextStorage,
    HttpModule,
  ],
})
export class SharedModule {}
