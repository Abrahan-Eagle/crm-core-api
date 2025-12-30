"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
class AggregateRoot {
    constructor() {
        this.domainEvents = new Set();
    }
    apply(event) {
        this.domainEvents.add(event);
    }
    getUncommittedEvents() {
        return Array.from(this.domainEvents);
    }
    uncommit() {
        this.domainEvents.clear();
    }
}
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregate-root.js.map