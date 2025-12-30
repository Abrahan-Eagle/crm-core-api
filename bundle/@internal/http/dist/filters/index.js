"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilters = void 0;
const default_exception_filter_1 = require("./default-exception.filter");
const not_found_exception_filter_1 = require("./not-found-exception.filter");
const service_unavailable_exception_filter_1 = require("./service-unavailable-exception.filter");
const unauthorized_exception_filter_1 = require("./unauthorized-exception.filter");
__exportStar(require("./default-exception.filter"), exports);
__exportStar(require("./not-found-exception.filter"), exports);
__exportStar(require("./service-unavailable-exception.filter"), exports);
__exportStar(require("./unauthorized-exception.filter"), exports);
exports.GlobalExceptionFilters = [
    default_exception_filter_1.DefaultExceptionFilter,
    not_found_exception_filter_1.NotFoundExceptionFilter,
    service_unavailable_exception_filter_1.ServiceUnavailableExceptionFilter,
    unauthorized_exception_filter_1.UnauthorizedExceptionFilter,
];
//# sourceMappingURL=index.js.map