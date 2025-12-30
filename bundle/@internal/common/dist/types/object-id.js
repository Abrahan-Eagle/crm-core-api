"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectId = void 0;
const id_1 = require("./id");
class ObjectId extends id_1.Id {
    static validate(validator, invalidError) {
        return validator.objectId(invalidError);
    }
}
exports.ObjectId = ObjectId;
//# sourceMappingURL=object-id.js.map