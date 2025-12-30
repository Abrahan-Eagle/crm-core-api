"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConfig = void 0;
const common_1 = require("@internal/common");
class MongoConfig extends common_1.Config {
    constructor(database, user, password, host, port, srv, options) {
        super();
        this.database = database;
        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;
        this.srv = srv;
        this.options = options;
    }
    get uri() {
        const userAndPass = (0, common_1.joinString)(':', this.user, this.password);
        const host = (0, common_1.joinString)(':', this.host, this.port.toString());
        const authHost = (0, common_1.joinString)('@', userAndPass, host);
        const protocol = (0, common_1.joinString)('+', 'mongodb', this.srv && 'srv');
        const database = (0, common_1.joinString)('?', this.database, this.options);
        return `${protocol}://${authHost}/${database}`;
    }
    static load(config) {
        const env = config.getFromObject('env');
        return new MongoConfig(env.getFromObjectOrThrow('MONGODB_DATABASE_NAME'), env.getFromObjectOrThrow('MONGODB_USERNAME'), env.getFromObjectOrThrow('MONGODB_PASSWORD'), env.getFromObjectOrThrow('MONGODB_HOST'), env
            .getFromObject('MONGODB_PORT')
            .map((port) => port && parseInt(port, 10))
            .getOrThrow(), env.getFromObject('MONGODB_SRV').orElse('true') === 'true', env.getFromObject('MONGODB_OPTIONS').orElse(''));
    }
}
exports.MongoConfig = MongoConfig;
//# sourceMappingURL=mongo.config.js.map