"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoIdService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const mongoose_1 = require("mongoose");
let MongoIdService = class MongoIdService {
    generate() {
        return common_2.ObjectId.load(new mongoose_1.Types.ObjectId().toString());
    }
};
exports.MongoIdService = MongoIdService;
exports.MongoIdService = MongoIdService = __decorate([
    (0, common_1.Injectable)()
], MongoIdService);
//# sourceMappingURL=mongo-id.service.js.map