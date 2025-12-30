import 'winston-daily-rotate-file';
import { Logger } from '@nestjs/common';
import { BaseAppConfig } from '../config';
export declare function createLogger(options: BaseAppConfig & {
    defaultMetadata: Record<string, (() => any) | any>;
}): Logger;
