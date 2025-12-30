import { ObjectId } from '@internal/common';
export interface IdService {
    generate(): ObjectId;
}
