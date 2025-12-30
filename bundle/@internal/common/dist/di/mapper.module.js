"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapperModule = void 0;
const decorators_1 = require("../decorators");
const mappers_1 = require("../mappers");
const transformers_1 = require("../transformers");
class MapperModule {
    static forRoot(transformers = []) {
        if (transformers.length === 0)
            transformers.push(...transformers_1.GlobalTransformers);
        const mapperProviders = [...decorators_1.mapperResponses].map(([name, responseClass]) => ({
            provide: name,
            useFactory: (...transformers) => new mappers_1.ObjectMapper(responseClass, transformers),
            inject: [...transformers],
        }));
        return {
            module: MapperModule,
            providers: [mappers_1.ObjectMapper, ...mapperProviders, ...transformers, ...transformers_1.GlobalTransformers],
            exports: [mappers_1.ObjectMapper, ...mapperProviders, ...transformers, ...transformers_1.GlobalTransformers],
            global: true,
        };
    }
}
exports.MapperModule = MapperModule;
//# sourceMappingURL=mapper.module.js.map