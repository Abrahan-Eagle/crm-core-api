"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedQuery = void 0;
const common_1 = require("@nestjs/common");
const pipes_1 = require("../pipes");
const MappedQuery = () => (0, common_1.Query)(new pipes_1.RequestTransformationPipe());
exports.MappedQuery = MappedQuery;
//# sourceMappingURL=mapped-query.decorator.js.map