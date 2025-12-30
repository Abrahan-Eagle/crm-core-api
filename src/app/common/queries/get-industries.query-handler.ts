import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { IndustryResponse, InjectionConstant } from '@/app/common';
import { GetIndustriesQuery } from '@/domain/common';
import { IndustryDocument } from '@/infra/adapters';

@QueryHandler(GetIndustriesQuery)
export class GetIndustriesQueryHandler extends BaseQueryHandler<GetIndustriesQuery, IndustryResponse[]> {
  constructor(
    @InjectModel(InjectionConstant.INDUSTRY_MODEL)
    private readonly model: Model<IndustryDocument>,
  ) {
    super();
  }

  handle(): Observable<IndustryResponse[]> {
    return of({}).pipe(
      mergeMap(() =>
        this.model.aggregate<IndustryDocument>(new Aggregate<IndustryDocument>().match({}).pipeline()).exec(),
      ),
      map((docs) => plainToInstance(IndustryResponse, docs, { excludeExtraneousValues: true })),
    );
  }
}
