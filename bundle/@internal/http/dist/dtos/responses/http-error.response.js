"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrorResponse = void 0;
class HttpErrorResponse {
    constructor(status, code, message, requestId, data) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.requestId = requestId;
        this.data = data;
    }
    toJSON() {
        return {
            status: this.status,
            code: this.code,
            message: this.message,
            request_id: this.requestId,
            data: this.data,
        };
    }
}
exports.HttpErrorResponse = HttpErrorResponse;
//# sourceMappingURL=http-error.response.js.map