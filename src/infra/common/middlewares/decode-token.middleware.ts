import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import jwt_decode from 'jwt-decode';

@Injectable()
export class DecodeTokenMiddleware implements NestMiddleware {
  use(request: Request & { token: any }, _: Response, next: NextFunction) {
    const auth = (request.headers as any)['authorization'];

    if (auth) {
      request.token = jwt_decode(auth);
    }

    next();
  }
}
