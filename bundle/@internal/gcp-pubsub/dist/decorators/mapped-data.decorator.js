"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedData = void 0;
const microservices_1 = require("@nestjs/microservices");
const pipes_1 = require("../pipes");
const MappedData = () => (0, microservices_1.Payload)(new pipes_1.PayloadDataTransformationPipe());
exports.MappedData = MappedData;
//# sourceMappingURL=mapped-data.decorator.js.map