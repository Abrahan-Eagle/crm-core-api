"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadDataTransformationPipe = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
let PayloadDataTransformationPipe = class PayloadDataTransformationPipe {
    transform(value, metadata) {
        const typeMapper = new common_2.ObjectMapper(metadata.metatype);
        return typeMapper.map(JSON.parse(value.data.toString()), { ignoreDecorators: false });
    }
};
exports.PayloadDataTransformationPipe = PayloadDataTransformationPipe;
exports.PayloadDataTransformationPipe = PayloadDataTransformationPipe = __decorate([
    (0, common_1.Injectable)()
], PayloadDataTransformationPipe);
//# sourceMappingURL=payload-data-transformation.pipe.js.map