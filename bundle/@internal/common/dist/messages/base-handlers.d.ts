import { Observable } from 'rxjs';
import { CommandQueryOrEvent, ICommand, IEvent, IQuery } from './aggregate-root';
export declare abstract class BaseHandler<TCommandQueryOrEvent extends CommandQueryOrEvent, TResult> {
    abstract handle(message: TCommandQueryOrEvent): Observable<TResult>;
}
export declare abstract class BaseEventHandler<E extends IEvent> extends BaseHandler<E, void> {
}
export declare abstract class BaseCommandHandler<C extends ICommand, R = void> extends BaseHandler<C, R> {
}
export declare abstract class BaseQueryHandler<Q extends IQuery, R> extends BaseHandler<Q, R> {
}
