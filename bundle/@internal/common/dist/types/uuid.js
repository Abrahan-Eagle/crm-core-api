"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID = void 0;
const uuid_1 = require("uuid");
const id_1 = require("./id");
class UUID extends id_1.Id {
    static generate() {
        return new UUID((0, uuid_1.v4)());
    }
    static validate(validator, invalidError) {
        return validator.uuid(invalidError);
    }
}
exports.UUID = UUID;
//# sourceMappingURL=uuid.js.map