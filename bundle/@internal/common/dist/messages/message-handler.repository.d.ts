import { Type } from '../types';
import { CommandQueryOrEvent } from './aggregate-root';
import { BaseCommandHandler, BaseEventHandler, BaseHandler, BaseQueryHandler } from './base-handlers';
export declare class MessageHandlerRepository {
    static readonly metadataKeys: {
        command: symbol;
        query: symbol;
        event: symbol;
        default: symbol;
    };
    private static readonly allHandlers;
    private static readonly commandHandlers;
    private static readonly queryHandlers;
    private static readonly eventHandlers;
    getFirstHandler<C extends CommandQueryOrEvent, R>(handledMessage: CommandQueryOrEvent, metadataKey?: symbol): Type<BaseHandler<C, R>>;
    getHandlers<C extends CommandQueryOrEvent, R>(handledMessage: CommandQueryOrEvent, metadataKey?: symbol): Type<BaseHandler<C, R>>[];
    private static registerHandler;
    static registerCommandHandler<T extends CommandQueryOrEvent>(message: T, handler: Type<BaseCommandHandler<T>>): void;
    static registerQueryHandler<T extends CommandQueryOrEvent>(message: T, handler: Type<BaseQueryHandler<T, any>>): void;
    static registerEventHandler<T extends CommandQueryOrEvent>(message: T, handler: Type<BaseEventHandler<T>>): void;
}
