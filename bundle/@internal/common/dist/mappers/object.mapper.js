"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectMapper = void 0;
const class_transformer_1 = require("class-transformer");
class ObjectMapper {
    constructor(responseClass, transformers = [], options = {}) {
        this.responseClass = responseClass;
        this.transformers = transformers;
        this.options = options;
        this.options = {
            excludeExtraneousValues: true,
            exposeUnsetFields: false,
            ignoreDecorators: true,
            exposeDefaultValues: false,
            strategy: 'excludeAll',
            ...options,
        };
    }
    map(data, options = {}) {
        options = { ...this.options, ...options };
        const dto = (0, class_transformer_1.plainToInstance)(this.responseClass, data, options);
        (Array.isArray(dto) ? dto : [dto]).forEach((item) => {
            const transform = this.transform.bind(this);
            item.toJSON = function () {
                transform(this);
                return (0, class_transformer_1.instanceToPlain)(this, { ...options, ignoreDecorators: false });
            };
        });
        return dto;
    }
    transform(data) {
        this.transformers.forEach((transformer) => transformer.transform(data));
    }
}
exports.ObjectMapper = ObjectMapper;
//# sourceMappingURL=object.mapper.js.map