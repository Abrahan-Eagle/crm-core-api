"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformDate = void 0;
const class_transformer_1 = require("class-transformer");
const moment_1 = __importDefault(require("moment"));
const errors_1 = require("../errors");
function TransformDate(params) {
    return (0, class_transformer_1.Transform)(({ obj, value, key, type }) => {
        if (type !== class_transformer_1.TransformationType.CLASS_TO_PLAIN)
            return value;
        const { format, utcOffset } = getParams(params, obj);
        if (Array.isArray(value))
            return value.map((value) => mapDate({ value, format, utcOffset, key }));
        return mapDate({ value, format, utcOffset, key });
    });
}
exports.TransformDate = TransformDate;
const getParams = (params, obj) => {
    let utcOffset = 0;
    if (typeof params === 'string')
        return { format: params, utcOffset };
    const format = params.format;
    if (params.utcOffset !== undefined)
        return { format, utcOffset: params.utcOffset };
    if (params.utcOffsetKey === undefined)
        return { format, utcOffset };
    utcOffset = obj[params.utcOffsetKey];
    if (obj[params.utcOffsetKey] === undefined) {
        throw new errors_1.InvalidValueException('Empty offset', `${params.utcOffsetKey} key is not defined in the object`);
    }
    return { format, utcOffset };
};
const mapDate = ({ value, format, utcOffset, key, }) => {
    if (!value)
        return value;
    if (!(typeof value === 'string') && !(value instanceof Date)) {
        throw new errors_1.InvalidValueException(value, `${key} Is not a valid date`);
    }
    const dateValue = value instanceof Date ? value : new Date(value);
    return dateValue && (0, moment_1.default)(dateValue).utcOffset(utcOffset).format(format);
};
//# sourceMappingURL=transform-date.decorator.js.map