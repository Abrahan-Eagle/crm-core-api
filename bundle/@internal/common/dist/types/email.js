"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const errors_1 = require("../errors");
const result_1 = require("./result");
const validator_1 = require("./validator");
class Email {
    constructor(value, verified, verifiedAt) {
        this.value = value;
        this.verified = verified;
        this.verifiedAt = verifiedAt;
    }
    equals(email) {
        return this.value === email.value;
    }
    static create(email, verified, verifiedAt) {
        return result_1.Result.combine([
            Email.validateEmail(email),
            Email.validateVerified(verified),
            Email.validateVerifiedAt(verifiedAt),
        ]).map(([email, verified, verifiedAt]) => new Email(email, verified, verifiedAt));
    }
    static createUnverified(email) {
        return Email.validateEmail(email).map((email) => new Email(email, false, null));
    }
    static validateEmail(email) {
        return validator_1.Validator.of(email)
            .required(() => new errors_1.BadRequest(errors_1.DomainErrorCode.EMAIL_EMPTY))
            .email(() => new errors_1.BadRequest(errors_1.DomainErrorCode.EMAIL_INVALID));
    }
    static validateVerified(verified) {
        return validator_1.Validator.of(verified)
            .boolean(() => new errors_1.BadRequest(errors_1.DomainErrorCode.EMAIL_VERIFIED_INVALID))
            .mapIfAbsent(() => false);
    }
    static validateVerifiedAt(verifiedAt) {
        return validator_1.Validator.of(verifiedAt)
            .datetime(() => new errors_1.BadRequest(errors_1.DomainErrorCode.EMAIL_VERIFIED_AT_INVALID))
            .mapIfAbsent(() => null);
    }
}
exports.Email = Email;
//# sourceMappingURL=email.js.map