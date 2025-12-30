import { ObjectId } from '@internal/common';
import { IdService } from './id.service';
export declare class MongoIdService implements IdService {
    generate(): ObjectId;
}
