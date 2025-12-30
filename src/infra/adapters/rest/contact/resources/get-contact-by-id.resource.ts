import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { ContactResponse } from '@/app/contact';
import { GetContactByIdQuery } from '@/domain/contact';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts/:contact_id')
export class GetContactByIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_CONTACT, Permission.READ_OWN_CONTACT)
  handle(@Req() req: Request, @Res() res: Response, @Param('contact_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => GetContactByIdQuery.create(id, requestHasPermission(Permission.READ_OWN_CONTACT, req)).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<ContactResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
