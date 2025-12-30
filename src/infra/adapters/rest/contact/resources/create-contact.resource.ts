import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, IdResponse } from '@internal/http';
import { Controller, Inject, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateContactRequest } from '@/app/contact';
import { ContactDuplicated, Id, InvalidEntityMediaType } from '@/domain/common';
import { CreateContactCommand, MAX_CONTACT_FILE_PER_TYPE, SUPPORTED_CONTACT_FILES } from '@/domain/contact';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

type ContactFiles = { [key in SUPPORTED_CONTACT_FILES]?: Express.Multer.File[] };

@Controller('v1/contacts')
export class CreateContactResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      Object.values(SUPPORTED_CONTACT_FILES).map((id) => ({ name: id, maxCount: MAX_CONTACT_FILE_PER_TYPE })),
    ),
  )
  @RequiredPermissions(Permission.CREATE_CONTACT)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: ContactFiles,
    @DynamicMappedBody() body: CreateContactRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        CreateContactCommand.create(
          data?.id,
          data?.firstName,
          data?.lastName,
          data?.birthdate,
          data?.ssn,
          data?.address,
          data?.phones,
          data?.emails,
          files,
          data?.note,
          this.getCurrentUserId() ? Id.load(this.getCurrentUserId()!) : null,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchInstanceOf(ContactDuplicated, (error) => this.conflict(req, res, error)),
      catchInstanceOf(InvalidEntityMediaType, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
