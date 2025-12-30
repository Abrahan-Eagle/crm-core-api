"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    static loadInstance(config) {
        return (this._instance ??= this.load(config));
    }
    static load(config) {
        throw new Error(`Method not implemented. Failed to load config ${JSON.stringify(config)}`);
    }
    constructor() { }
    static getInstance() {
        return this._instance;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map