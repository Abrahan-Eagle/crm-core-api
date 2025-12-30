"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedBody = void 0;
const common_1 = require("@nestjs/common");
const pipes_1 = require("../pipes");
const MappedBody = () => (0, common_1.Body)(new pipes_1.RequestTransformationPipe());
exports.MappedBody = MappedBody;
//# sourceMappingURL=mapped-body.decorator.js.map