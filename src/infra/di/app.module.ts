import { AppConfig, CommonModule, ConfigManager, ENVIRONMENTS } from '@internal/common';
import {
  CreateRequestContextMiddleware,
  HttpModule,
  RouterLoggerMiddleware,
  SetRequestIdMiddleware,
} from '@internal/http';
import { MongoConfig } from '@internal/mongo';
import { Global, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import {
  DashboardConfig,
  ExternalContactsConfig,
  IdentityProviderConfig,
  MailerServiceConfig,
  MediaConfig,
  NotificationAPIConfig,
  SchedulerServiceConfig,
  TenantConfig,
  URLSignerConfig,
  VoIPProviderConfig,
} from '@/app/common';

import {
  CreateAuthContextMiddleware,
  CreateWebhookContextMiddleware,
  DecodeTokenMiddleware,
  PermissionsGuard,
  validateAuthorizationToken,
  WebhookAuthMiddleware,
} from '../common';
import { ApplicationModule } from './application.module';
import { BankModule } from './bank.module';
import { CampaignModule } from './campaign.module';
import { CompanyModule } from './company.module';
import { ContactModule } from './contact.module';
import { HealthModule } from './health.module';
import { LeadModule } from './lead.module';
import { SharedModule } from './shared.module';
import { UserModule } from './user.module';

@Global()
@Module({
  imports: [
    HttpModule,
    CommonModule.forRoot({
      configs: [
        AppConfig,
        TenantConfig,
        MongoConfig,
        MediaConfig,
        ExternalContactsConfig,
        SchedulerServiceConfig,
        MailerServiceConfig,
        URLSignerConfig,
        IdentityProviderConfig,
        VoIPProviderConfig,
        NotificationAPIConfig,
        DashboardConfig,
      ],
    }),
    MongooseModule.forRoot(ConfigManager.get(MongoConfig).uri, {
      lazyConnection: true,
      autoIndex: process.env?.NODE_ENV !== ENVIRONMENTS.PROD,
      autoCreate: process.env?.NODE_ENV !== ENVIRONMENTS.PROD,
      compressors: 'zstd',
    }),
    HttpModule,
    SharedModule,
    HealthModule,
    BankModule,
    ContactModule,
    CompanyModule,
    ApplicationModule,
    UserModule,
    LeadModule,
    CampaignModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [SharedModule],
})
export class AppModule {
  private readonly ALL_ROUTES: RouteInfo = { path: '*', method: RequestMethod.ALL };

  private readonly WEBHOOK_ROUTES: RouteInfo[] = [
    {
      path: '/v1/applications/:application_id/send-to-banks',
      method: RequestMethod.PUT,
    },
    {
      path: '/v1/webhooks/applications/notification/reject',
      method: RequestMethod.PUT,
    },
    {
      path: '/v1/webhooks/affiliate',
      method: RequestMethod.POST,
    },
    {
      path: '/v1/webhooks/affiliate/consolidate',
      method: RequestMethod.PUT,
    },
    { path: '/v1/campaigns/:campaign_id/send-next', method: RequestMethod.GET },
    { path: '/v1/campaigns/notification', method: RequestMethod.POST },
    { path: '/v1/campaigns/stop-all', method: RequestMethod.POST },
  ];

  private readonly PUBLIC_ROUTES: RouteInfo[] = [
    {
      path: '/v1/config',
      method: RequestMethod.GET,
    },
    {
      path: '/health',
      method: RequestMethod.GET,
    },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      // Global Middlewares
      .apply(SetRequestIdMiddleware, CreateRequestContextMiddleware, RouterLoggerMiddleware)
      .forRoutes(this.ALL_ROUTES)
      // Webhook Middleware
      .apply(WebhookAuthMiddleware, CreateWebhookContextMiddleware)
      .forRoutes(...this.WEBHOOK_ROUTES)
      // Auth0 Middleware
      .apply(validateAuthorizationToken, CreateAuthContextMiddleware, DecodeTokenMiddleware)
      .exclude(...this.WEBHOOK_ROUTES, ...this.PUBLIC_ROUTES)
      .forRoutes(this.ALL_ROUTES);
  }
}
