import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource, IdResponse, MappedBody } from '@internal/http';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateAffiliateRequest } from '@/app/user';
import { Id, UserDuplicated } from '@/domain/common';
import { CreateAffiliateCommand } from '@/domain/user';

@Controller('v1/webhooks/affiliate')
export class CreateAffiliateResource extends AbstractHttpResource {
  @Post()
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: CreateAffiliateRequest): Observable<Response> {
    return of(body).pipe(
      map((data) => CreateAffiliateCommand.create(data?.id, data?.email).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchInstanceOf(UserDuplicated, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
