"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachOnSubscribe = void 0;
const rxjs_1 = require("rxjs");
function attachOnSubscribe(obs, fn) {
    return new rxjs_1.Observable(function (subscriber) {
        let subscription;
        fn(() => (subscription = obs.subscribe(subscriber)), this);
        return () => subscription?.unsubscribe();
    });
}
exports.attachOnSubscribe = attachOnSubscribe;
//# sourceMappingURL=attach-on-subscribe.js.map