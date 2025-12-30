"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitConfig = void 0;
const common_1 = require("@internal/common");
class LimitConfig {
    constructor(name, limit, timeInSeconds, countingExpression, countingCondition) {
        this.name = name;
        this.limit = limit;
        this.timeInSeconds = timeInSeconds;
        this.countingExpression = countingExpression;
        this.countingCondition = countingCondition;
    }
    getName() {
        const parts = [this.name, this.countingExpression];
        if (this.countingCondition)
            parts.push(this.countingCondition.toString());
        return parts.filter(Boolean).join(':');
    }
    static load(name, config) {
        const expression = config.getFromObjectOrThrow('countingExpression');
        return new LimitConfig(name, config.getFromObjectOrThrow('limit'), config.getFromObjectOrThrow('timeInSeconds'), expression, config
            .getFromObject('countingCondition')
            .map((condition) => new RegExp(condition))
            .orElse(undefined));
    }
    static loadList(name, config) {
        const limitConfigs = config
            .map((limits, optional) => limits.map((limit, index) => {
            const limitTraced = optional.traced(limit, index);
            return LimitConfig.load(name, limitTraced);
        }))
            .getOrThrow();
        return common_1.Validator.of(limitConfigs)
            .unique((limit) => limit.getName(), () => new common_1.InvalidValueException(config.valueTrace, 'Limit config should be unique'))
            .getOrThrow();
    }
}
exports.LimitConfig = LimitConfig;
//# sourceMappingURL=limit.config.js.map