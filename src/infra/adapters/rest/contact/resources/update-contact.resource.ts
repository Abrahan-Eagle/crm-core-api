import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateContactRequest } from '@/app/contact';
import { UpdateContactCommand } from '@/domain/contact';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts/:contact_id')
export class UpdateContactResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_CONTACT)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('contact_id') id: string,
    @MappedBody() body: UpdateContactRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        UpdateContactCommand.create(
          id,
          data?.firstName,
          data?.lastName,
          data?.birthdate,
          data?.address,
          data?.phones,
          data?.emails,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
