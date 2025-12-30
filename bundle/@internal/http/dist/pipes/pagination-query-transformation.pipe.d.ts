import { PipeTransform } from '@nestjs/common';
import { PaginationQuery } from '../queries';
export declare class PaginationQueryTransformationPipe implements PipeTransform {
    transform(query: Record<string, string>): PaginationQuery;
}
