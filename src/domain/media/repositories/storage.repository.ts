import { Observable } from 'rxjs';

import { ENTITY_MEDIA_TYPE } from '@/app/common';
import { BufferFile } from '@/domain/common';

export interface StorageRepository {
  saveFile(file: BufferFile, type: ENTITY_MEDIA_TYPE): Observable<void>;
  deleteFile(name: string, type: ENTITY_MEDIA_TYPE): Observable<void>;
  getFile(name: string, type: ENTITY_MEDIA_TYPE): Observable<Uint8Array>;
}
