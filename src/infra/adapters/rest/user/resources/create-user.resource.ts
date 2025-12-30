import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource, IdResponse, MappedBody } from '@internal/http';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateUserRequest } from '@/app/user';
import { Id, UserDuplicated } from '@/domain/common';
import { CreateUserCommand } from '@/domain/user';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users')
export class CreateUserResource extends AbstractHttpResource {
  @Post()
  @RequiredPermissions(Permission.CREATE_USER)
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: CreateUserRequest): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        CreateUserCommand.create(
          data?.id,
          data?.firstName,
          data?.lastName,
          data?.email,
          data?.password,
          data?.roles,
          data?.tenants,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchInstanceOf(UserDuplicated, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
