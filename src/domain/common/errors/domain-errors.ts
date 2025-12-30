import { DomainError } from '@internal/common';

import { DomainErrorCode } from './error-code';

export class CommonErrors extends DomainError {}

export class UserErrors extends DomainError {}

export class UserDuplicated extends UserErrors {
  constructor() {
    const code = DomainErrorCode.USER_DUPLICATED;
    super(code.value, code.description);
  }
}

export class InvalidEntityMediaType extends DomainError {
  constructor(value: unknown, message?: string) {
    if (value === undefined || value === null) {
      value = typeof value;
    }

    super('INVALID_ENTITY_MEDIA_TYPE', message || `Entity media type '${value}' is not supported`);
  }
}

export class InvalidTenantId extends DomainError {
  constructor(value: unknown, message?: string) {
    if (value === undefined || value === null) {
      value = typeof value;
    }

    super('INVALID_TENANT_ID', message || `Tenant id '${value}' is not supported`);
  }
}

export class ApplicationErrors extends DomainError {}
export class ApplicationDuplicated extends ApplicationErrors {
  constructor() {
    const code = DomainErrorCode.APPLICATION_DUPLICATED;
    super(code.value, code.description);
  }
}

export class ApplicationDraftIncompleted extends ApplicationErrors {
  constructor() {
    const code = DomainErrorCode.APPLICATION_DRAFT_INCOMPLETED;
    super(code.value, code.description);
  }
}

export class ApplicationBlocked extends ApplicationErrors {
  constructor(status: string) {
    const code = DomainErrorCode.APPLICATION_BLOCKED;
    super(code.value, code.format(status));
  }
}

export class ApplicationPositionNotDefined extends ApplicationErrors {
  constructor() {
    const code = DomainErrorCode.APPLICATION_POSITION_NOT_DEFINED;
    super(code.value, code.description);
  }
}

export class ApplicationNotApproved extends ApplicationErrors {
  constructor(status: string) {
    const code = DomainErrorCode.APPLICATION_NOT_APPROVED;
    super(code.value, code.format(status));
  }
}

export class NotificationDuplicated extends ApplicationErrors {
  constructor() {
    const code = DomainErrorCode.NOTIFICATION_BANK_DUPLICATED;
    super(code.value, code.description);
  }
}

export class CommissionDuplicated extends ApplicationErrors {
  constructor() {
    const code = DomainErrorCode.COMMISSION_DUPLICATED;
    super(code.value, code.description);
  }
}

export class BankErrors extends DomainError {}
export class BankDuplicated extends BankErrors {
  constructor() {
    const code = DomainErrorCode.BANK_DUPLICATED;
    super(code.value, code.description);
  }
}

export class ContactErrors extends DomainError {}
export class ContactDuplicated extends ContactErrors {
  constructor() {
    const code = DomainErrorCode.CONTACT_DUPLICATED;
    super(code.value, code.description);
  }
}

export class CompanyErrors extends DomainError {}
export class CompanyDuplicated extends BankErrors {
  constructor() {
    const code = DomainErrorCode.COMPANY_DUPLICATED;
    super(code.value, code.description);
  }
}

export class FileErrors extends DomainError {}
export class FileDuplicated extends FileErrors {
  constructor() {
    const code = DomainErrorCode.FILE_DUPLICATED;
    super(code.value, code.description);
  }
}

export class VOIPErrors extends DomainError {}

export class CallFailed extends VOIPErrors {
  constructor(message: string) {
    const code = DomainErrorCode.CALL_FAILED;
    super(code.value, message);
  }
}

export class CampaignErrors extends DomainError {}

export class CampaignFinish extends CampaignErrors {
  constructor() {
    const code = DomainErrorCode.CAMPAIGN_FINISH;
    super(code.value, code.description);
  }
}
