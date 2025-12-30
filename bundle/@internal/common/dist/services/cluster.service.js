"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterService = void 0;
const node_cluster_1 = __importDefault(require("node:cluster"));
const common_1 = require("@nestjs/common");
const os_1 = require("os");
class ClusterService {
    static clusterize(callback, ...onlyOnEnv) {
        const env = process.env.NODE_ENV;
        if (!onlyOnEnv.includes(env))
            return callback();
        if (node_cluster_1.default.isPrimary) {
            this.logger.log(`Primary process (${process.pid}) is running...`);
            const cpusCount = (0, os_1.cpus)().length;
            const workersPlural = cpusCount === 1 ? 'worker' : 'workers';
            this.logger.log(`Forking into ${cpusCount} ${workersPlural}`);
            for (let i = 0; i < cpusCount; i++) {
                node_cluster_1.default.fork();
            }
            node_cluster_1.default.on('exit', (worker) => {
                this.logger.log(`worker ${worker.process.pid} died`);
            });
        }
        else {
            callback();
        }
    }
}
exports.ClusterService = ClusterService;
ClusterService.logger = new common_1.Logger(ClusterService.name);
//# sourceMappingURL=cluster.service.js.map