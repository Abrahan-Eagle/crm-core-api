"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedUser = exports.NotFound = exports.Conflict = exports.BadRequest = void 0;
const domain_exception_1 = require("./domain-exception");
const error_code_1 = require("./error-code");
class BadRequest extends domain_exception_1.DomainError {
    constructor(code, ...args) {
        const values = args.map((arg = '[empty]') => JSON.stringify(arg).replace(/"/g, "'"));
        super(code.value, code.format(...values));
    }
}
exports.BadRequest = BadRequest;
class Conflict extends domain_exception_1.DomainError {
    constructor(code, ...args) {
        const values = args.map((arg = '[empty]') => JSON.stringify(arg).replace(/"/g, "'"));
        super(code.value, code.format(...values));
    }
}
exports.Conflict = Conflict;
class NotFound extends domain_exception_1.DomainError {
    constructor(message, suffixCode = '') {
        const code = error_code_1.DomainErrorCode.NOT_FOUND;
        super(code.value + suffixCode, message);
    }
    static of(entity, id) {
        entity = typeof entity === 'string' ? entity : entity.name;
        id = typeof id === 'string' ? id : id.toString();
        const message = error_code_1.DomainErrorCode.NOT_FOUND.format(entity, id);
        return new NotFound(message);
    }
    static ofEntity(entity, id) {
        id = typeof id === 'string' ? id : id.toString();
        const [code, name] = NotFound.getSuffixCode(entity.name);
        const message = error_code_1.DomainErrorCode.NOT_FOUND.format(name, id);
        return new NotFound(message, `_${code.toUpperCase()}`);
    }
    static getSuffixCode(entityName) {
        const code = entityName.replace(/(?<=.)[A-Z]/g, '_$1');
        return [code.toUpperCase(), code.replaceAll('_', ' ')];
    }
    isOfEntity(entity) {
        const [suffix] = NotFound.getSuffixCode(entity.name);
        return this.code === `${error_code_1.DomainErrorCode.NOT_FOUND.value}_${suffix}`;
    }
}
exports.NotFound = NotFound;
class UnauthorizedUser extends domain_exception_1.DomainError {
    constructor(message) {
        const code = error_code_1.DomainErrorCode.UNAUTHORIZED_USER;
        super(code.value, message || code.description);
    }
}
exports.UnauthorizedUser = UnauthorizedUser;
//# sourceMappingURL=domain-errors.js.map