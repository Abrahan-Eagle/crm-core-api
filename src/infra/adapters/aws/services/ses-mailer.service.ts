import { SendEmailCommand, SESv2 } from '@aws-sdk/client-sesv2';
import { mapToVoid } from '@internal/common';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { catchError, mergeMap, Observable, of, throwError } from 'rxjs';

import { MailerServiceConfig } from '@/app/common';
import { EmailRequest, MailerService } from '@/domain/common';

class SendRawEmailCommand extends SendEmailCommand {
  constructor(params: any) {
    const input = {
      Content: {
        Raw: {
          Data: params.RawMessage.Data,
        },
      },
      FromEmailAddress: params.Source,
      Destination: {
        ToAddresses: params.Destinations,
      },
    };
    super(input);
  }
}

@Injectable()
export class SESMailerService implements MailerService {
  private readonly logger = new Logger(SESMailerService.name);

  constructor(private readonly mailerConfig: MailerServiceConfig) {}

  send(email: EmailRequest): Observable<void> {
    const { apiKey: accessKeyId, secret: secretAccessKey } = this.mailerConfig.config;

    return of(
      nodemailer.createTransport({
        SES: {
          ses: new SESv2({
            region: 'us-east-1',
            apiVersion: '2019-09-27',
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }),
          aws: { SendRawEmailCommand: SendRawEmailCommand },
        },
      }),
    ).pipe(
      mergeMap((transporter) =>
        transporter.sendMail({
          from: email.from,
          subject: email.subject,
          to: email.to,
          bcc: email.bcc,
          text: email.message,
          html: email.html,
          attachments: email.attachments.map((url) => ({ filename: this.fileNameFromURL(url), path: url })),
        }),
      ),
      mapToVoid(),
      catchError((error) => {
        this.logger.error('Error sending email');
        this.logger.error(JSON.stringify(error, null, 2));

        return throwError(() => error);
      }),
    );
  }

  private fileNameFromURL(url: string): string {
    return new URL(url).pathname.split('/').at(-1) ?? '';
  }
}
