import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { User, UserRepository } from '@/domain/user';
import { Id, DomainErrorCode } from '@/domain/common';
import { InjectionConstant } from '@/app/common';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class UserSeeder extends BaseSeeder {
  constructor(
    connection: Connection,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super(connection);
  }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Users...');

    const usersToCreate = 20;
    const users: User[] = [];

    for (let i = 0; i < usersToCreate; i++) {
      const userId = Id.create(
        new Types.ObjectId().toString(),
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ).getOrThrow();

      const userResult = User.create(
        userId,
        faker.name.firstName(),
        faker.name.lastName(),
        faker.internet.email(),
        ['rol_A3tdfj0JvuzJEqQk'], // Default role
        ['business_market_finders'], // Default tenant
      );

      if (userResult.isSuccess()) {
        users.push(userResult.getOrThrow());
      }
    }

    // Save users
    for (const user of users) {
      try {
        await firstValueFrom(this.userRepository.createOne(user));
      } catch (error) {
        // Skip duplicates
        if (error?.code !== 11000) {
          console.error(`Error creating user ${user.email}:`, error);
        }
      }
    }

    console.log(`✅ Created ${users.length} users`);
  }

  async clean(): Promise<void> {
    // Clean users if needed
    await this.connection.collection('users').deleteMany({});
  }
}
