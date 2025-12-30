import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';

import { SchedulerServiceConfig } from '@/app/common';

@Injectable()
export class WebhookAuthMiddleware implements NestMiddleware {
  constructor(private readonly scheduler: SchedulerServiceConfig) {}

  use(req: Request, _: Response, next: NextFunction) {
    const key = req.query?.key;

    if (!key || key !== this.scheduler.config.webhookAuthKey) {
      throw new UnauthorizedError();
    }

    return next();
  }
}
