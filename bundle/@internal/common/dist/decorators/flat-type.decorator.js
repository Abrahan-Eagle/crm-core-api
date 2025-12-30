"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlatType = void 0;
const class_transformer_1 = require("class-transformer");
const utils_1 = require("../utils");
const FlatType = (type, options) => (0, class_transformer_1.Transform)(({ obj, value, type: transformationType, options: transformOptions }) => {
    if (transformationType === class_transformer_1.TransformationType.CLASS_TO_PLAIN)
        return value;
    const classType = type();
    if (transformationType === class_transformer_1.TransformationType.PLAIN_TO_CLASS)
        return (0, class_transformer_1.plainToInstance)(classType, options?.prefix ? (0, utils_1.extractPrefixed)(options.prefix, obj, { camelCase: options?.camelCase }) : obj, transformOptions);
    if (transformationType !== class_transformer_1.TransformationType.CLASS_TO_CLASS)
        return;
    if (value instanceof classType)
        return value;
    const targetObj = Object.assign(new classType(), options?.prefix ? (0, utils_1.extractPrefixed)(options.prefix, obj, { camelCase: options?.camelCase }) : obj);
    return (0, class_transformer_1.instanceToInstance)(targetObj, transformOptions);
});
exports.FlatType = FlatType;
//# sourceMappingURL=flat-type.decorator.js.map