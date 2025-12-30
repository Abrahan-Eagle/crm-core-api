import { Type } from '../types';
export declare const suffix = "Mapper";
export declare const mapperResponses: Map<string, Type<unknown>>;
export declare const InjectMapper: <T>(responseClass: Type<T>) => PropertyDecorator & ParameterDecorator;
