import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { User } from '@/domain/user';

import { PhoneMapper } from '../../common';
import { UserDocument } from '../documents';

@Injectable()
export class UserMapper extends AbstractMapper<UserDocument, User> {
  constructor(private readonly phoneMapper: PhoneMapper) {
    super();
  }

  map(from: UserDocument): User {
    const phoneNumber = from.phone != null ? this.phoneMapper.map(from.phone) : null;

    const UserInstance = class extends User {
      static load(): User {
        return new User(
          Id.load(from._id.toString()),
          from.first_name,
          from.last_name,
          from.email,
          from.referral_id,
          from.roles,
          from.tenants,
          phoneNumber,
          from.created_at,
          from.updated_at,
          from.deleted_at,
          from.version,
        );
      }
    };
    return UserInstance.load();
  }

  reverseMap(from: User): UserDocument {
    const doc = new UserDocument();

    doc._id = new Types.ObjectId(from.id.toString());

    doc.first_name = from.firstName;
    doc.last_name = from.lastName;
    doc.email = from.email;
    doc.referral_id = from.referralId;
    doc.roles = from.roles;
    doc.tenants = from.tenants;
    doc.phone = from.phone != null ? this.phoneMapper.reverseMap(from.phone) : null;
    doc.created_at = from.createdAt;
    doc.updated_at = from.updatedAt;
    doc.deleted_at = from.deletedAt;
    doc.version = from.version ?? 0;
    return doc;
  }
}
