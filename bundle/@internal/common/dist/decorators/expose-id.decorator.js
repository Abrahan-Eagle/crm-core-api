"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposeId = void 0;
const class_transformer_1 = require("class-transformer");
const ExposeId = (options) => (target, propertyKey) => {
    (0, class_transformer_1.Expose)(options)(target, propertyKey);
    (0, class_transformer_1.Transform)(({ obj, type, key }) => {
        if (type !== class_transformer_1.TransformationType.CLASS_TO_PLAIN)
            return obj[propertyKey];
        return obj[key]?.toString();
    })(target, propertyKey);
};
exports.ExposeId = ExposeId;
//# sourceMappingURL=expose-id.decorator.js.map