"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectMapper = exports.mapperResponses = exports.suffix = void 0;
const common_1 = require("@nestjs/common");
exports.suffix = 'Mapper';
exports.mapperResponses = new Map();
const InjectMapper = (responseClass) => {
    const mapperName = responseClass.name + exports.suffix;
    if (!exports.mapperResponses.has(mapperName)) {
        exports.mapperResponses.set(mapperName, responseClass);
    }
    return (0, common_1.Inject)(mapperName);
};
exports.InjectMapper = InjectMapper;
//# sourceMappingURL=inject-mapper.decorator.js.map