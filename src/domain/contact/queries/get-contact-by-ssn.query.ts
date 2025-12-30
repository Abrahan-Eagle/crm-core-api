import { OptionalValue, Result } from '@internal/common';

import { Contact } from '../entities';

export class GetContactBySSNQuery {
  private constructor(public readonly ssn: string) {}

  static create(ssn: OptionalValue<string>): Result<GetContactBySSNQuery> {
    return Contact.validateSSN(ssn).map((ssn) => new GetContactBySSNQuery(ssn));
  }
}
