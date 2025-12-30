import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CommandQueryOrEvent, ICommand, IQuery, MessageDispatcher } from '../messages';
import { MessageHandlerRepository } from './message-handler.repository';
export declare class DefaultMessageDispatcher implements MessageDispatcher {
    private readonly repository;
    private readonly moduleRef;
    constructor(repository: MessageHandlerRepository, moduleRef: ModuleRef);
    dispatch<R>(message: CommandQueryOrEvent, messageType?: 'query' | 'command'): Observable<R>;
    dispatchQuery<R>(query: IQuery): Observable<R>;
    dispatchCommand<R>(command: ICommand): Observable<R>;
}
