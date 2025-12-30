import { AbstractHttpResource, IdResponse } from '@internal/http';
import { Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateCampaignRequest } from '@/app/campaign';
import { CreateCampaignCommand } from '@/domain/campaign';
import { Id } from '@/domain/common';
import { DynamicMappedBody, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/campaigns')
export class CreateCampaignResource extends AbstractHttpResource {
  @Post()
  @RequiredPermissions(Permission.CREATE_CAMPAIGN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 20 * 1048576,
      },
    }),
  )
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @DynamicMappedBody() body: CreateCampaignRequest,
  ): Observable<Response> {
    return of(body).pipe(
      mergeMap((body) => CreateCampaignCommand.create(body?.id, body?.sender, body?.subject, body?.message, file)),
      map((command) => command.getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
