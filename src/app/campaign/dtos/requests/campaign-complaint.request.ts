import { Expose, Type } from 'class-transformer';

class Bounce {
  @Expose()
  timestamp: string;

  @Expose()
  @Type(() => BouncedRecipient)
  bouncedRecipients: BouncedRecipient[];
}

class BouncedRecipient {
  @Expose()
  emailAddress: string;
}

class Complaint {
  @Expose()
  timestamp: string;

  @Expose()
  @Type(() => ComplainedRecipient)
  complainedRecipients: ComplainedRecipient[];
}

class ComplainedRecipient {
  @Expose()
  emailAddress: string;
}

export class CampaignComplaintRequest {
  @Expose()
  notificationType: string;

  @Expose()
  @Type(() => Bounce)
  bounce: Bounce;

  @Expose()
  @Type(() => Complaint)
  complaint: Complaint;
}
