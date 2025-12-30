import { InstanceOf, Type } from '../types';
export type ICommand = InstanceOf<Type<any>>;
export type IQuery = InstanceOf<Type<any>>;
export type IEvent = InstanceOf<Type<any>>;
export type CommandQueryOrEvent = ICommand | IQuery | IEvent;
export declare class AggregateRoot {
    private readonly domainEvents;
    apply(event: IEvent): void;
    getUncommittedEvents(): ReadonlyArray<IEvent>;
    uncommit(): void;
}
