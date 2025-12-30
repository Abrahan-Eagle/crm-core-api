import { Result } from '@internal/common';

import { Id } from '@/domain/common';

export class CallLog {
  protected constructor(
    public readonly createdBy: Id,
    public readonly createdAt: Date,
  ) {}

  static create(createdBy: Id, createdAt: Date): Result<CallLog> {
    return Result.ok(new CallLog(createdBy, createdAt));
  }
}
