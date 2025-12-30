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
exports.GlobalTransformers = void 0;
const empty_object_tranformer_1 = require("./empty-object.tranformer");
const non_nullish_tranformer_1 = require("./non-nullish.tranformer");
__exportStar(require("./empty-object.tranformer"), exports);
__exportStar(require("./non-nullish.tranformer"), exports);
exports.GlobalTransformers = [non_nullish_tranformer_1.NonNullishTransformer, empty_object_tranformer_1.EmptyObjectTransformer];
//# sourceMappingURL=index.js.map