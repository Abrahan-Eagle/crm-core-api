import { AppConfig, ConfigManager, createLogger } from '@internal/common';
import { RequestContextStorage } from '@internal/http';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { default as compression } from 'compression';

import { AppModule } from '@/infra/di';

import { ExtendedAuthContextStorage, ForbiddenExceptionFilter, UnauthorizedExceptionFilter } from './infra/common';

async function bootstrap() {
  const appConfig = ConfigManager.get(AppConfig);
  let app: NestExpressApplication;
  // eslint-disable-next-line prefer-const
  app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: createLogger({
      ...appConfig.app,
      defaultMetadata: {
        request: () => app?.get(RequestContextStorage).getStore(),
        auth: () => app?.get(ExtendedAuthContextStorage).getStore(),
      },
    }),
  });

  app.useBodyParser('text', { type: 'text/*' });

  app.enableCors({
    origin: appConfig.server.allowOrigins,
    methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(compression());

  app.setGlobalPrefix(appConfig.server.prefix);
  app.useGlobalFilters(new UnauthorizedExceptionFilter(), new ForbiddenExceptionFilter());

  await app.listen(appConfig.server.port);
  appConfig.printUsage();
}
bootstrap();
// ClusterService.clusterize(bootstrap, ENVIRONMENTS.PROD);
