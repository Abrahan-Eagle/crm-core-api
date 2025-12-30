import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { GetUserByIdQuery, User } from '@/domain/user';
import { UserDocument } from '@/infra/adapters';

import { UserResponse } from '../dtos';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler extends BaseQueryHandler<GetUserByIdQuery, UserResponse> {
  constructor(
    @InjectModel(InjectionConstant.USER_MODEL)
    private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  handle(query: GetUserByIdQuery): Observable<UserResponse> {
    return of(query).pipe(
      map((query) => new Types.ObjectId(query.id.toString())),
      mergeMap((_id) => this.userModel.findOne({ _id })),
      throwIfVoid(() => NotFound.of(User, query.id.toString())),
      map((user) => plainToInstance(UserResponse, user, { excludeExtraneousValues: true })),
    );
  }
}
