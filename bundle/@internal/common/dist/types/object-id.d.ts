import { MapErrorFunction } from './custom-types';
import { Id } from './id';
import { Validator } from './validator';
export declare class ObjectId extends Id {
    protected static validate(validator: Validator<string>, invalidError: MapErrorFunction<string>): Validator<string>;
}
