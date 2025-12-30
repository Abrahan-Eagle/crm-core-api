"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MongoTransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTransactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("@internal/common");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const context_storages_1 = require("../context-storages");
let MongoTransactionService = MongoTransactionService_1 = class MongoTransactionService {
    constructor(connection, context) {
        this.connection = connection;
        this.context = context;
        this.logger = new common_1.Logger(MongoTransactionService_1.name);
    }
    runInTransaction(action) {
        let returnValue;
        let session;
        return (0, rxjs_1.of)(null).pipe((0, rxjs_1.mergeMap)(() => this.connection.startSession()), (0, rxjs_1.tap)((_session) => (session = _session)), (0, rxjs_1.delayWhen)((session) => session.withTransaction(() => (0, rxjs_1.firstValueFrom)((0, common_2.attachOnSubscribe)(action(), (done) => this.context.run({ session }, () => done())).pipe((0, rxjs_1.tap)((value) => (returnValue = value)))))), (0, common_2.mapToVoid)(), (0, rxjs_1.map)(() => returnValue), (0, rxjs_1.finalize)(() => session &&
            session.endSession().catch((error) => this.logger.debug('Failed while trying to end session', error.stack))));
    }
};
exports.MongoTransactionService = MongoTransactionService;
exports.MongoTransactionService = MongoTransactionService = MongoTransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        context_storages_1.MongoTransactionContextStorage])
], MongoTransactionService);
//# sourceMappingURL=mongo-transaction.service.js.map