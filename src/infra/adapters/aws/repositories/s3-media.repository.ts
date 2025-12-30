import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { mapToVoid } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { from, mergeMap, Observable, of } from 'rxjs';

import { ENTITY_MEDIA_TYPE, MediaConfig } from '@/app/common';
import { BufferFile } from '@/domain/common';
import { StorageRepository } from '@/domain/media';

@Injectable()
export class S3StorageRepository implements StorageRepository {
  constructor(
    private readonly storage: S3Client,
    private readonly config: MediaConfig,
  ) {}

  deleteFile(name: string, type: ENTITY_MEDIA_TYPE): Observable<void> {
    const { bucket, path } = this.config.getMediaConfig(type);
    return of(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: `${path}/${name}`,
      }),
    ).pipe(
      mergeMap((command) => this.storage.send(command)),
      mapToVoid(),
    );
  }

  saveFile(file: BufferFile, type: ENTITY_MEDIA_TYPE): Observable<void> {
    const { bucket, path } = this.config.getMediaConfig(type);

    return new Observable((subscriber) => {
      const upload = new Upload({
        client: this.storage,
        params: {
          Bucket: bucket,
          Key: `${path}/${file.name}`,
          Body: file.file,
          ContentType: file.mimeType,
        },
      });

      upload
        .done()
        .then(() => {
          subscriber.next();
          subscriber.complete();
        })
        .catch((error) => subscriber.error(error));
    });
  }

  getFile(name: string, type: ENTITY_MEDIA_TYPE): Observable<Uint8Array> {
    const { bucket, path } = this.config.getMediaConfig(type);

    return from(
      this.storage.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: `${path}/${name}`,
        }),
      ),
    ).pipe(mergeMap((data) => data!.Body!.transformToByteArray()));
  }
}
