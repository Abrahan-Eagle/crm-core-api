'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PubSubServer = exports.SubscriptionHandler = void 0;
const pubsub_1 = require('@google-cloud/pubsub');
const common_1 = require('@nestjs/common');
const microservices_1 = require('@nestjs/microservices');
const constants_1 = require('@nestjs/microservices/constants');
const rxjs_1 = require('rxjs');
const pubsub_context_1 = require('./pubsub.context');
const SubscriptionHandler = (pattern) => (0, microservices_1.MessagePattern)(pattern);
exports.SubscriptionHandler = SubscriptionHandler;
class PubSubServer extends microservices_1.Server {
  constructor(options) {
    super();
    this.options = options;
    this.logger = new common_1.Logger(PubSubServer.name);
    this.subscriptions = [];
    this.clientConfig = this.options.config;
    this.client = new pubsub_1.PubSub(this.clientConfig);
  }
  async listen(callback) {
    const handlers = this.getHandlers();
    if (!handlers.size) {
      this.logger.warn('No handlers were found to handle incoming messages');
      callback();
      return;
    }
    handlers.forEach((handler, pattern) => {
      const subscription = this.registerSubscription(pattern, handler);
      this.subscriptions.push(subscription);
    });
    callback();
  }
  async close() {
    await Promise.all(this.subscriptions.map((subscription) => subscription.close()));
    await this.client?.close();
  }
  registerSubscription(pattern, handler) {
    const { subscription, topic: topicName } = JSON.parse(pattern);
    const topic = topicName ? this.client.topic(topicName) : undefined;
    return this.client
      .subscription(subscription, { topic })
      .on(constants_1.MESSAGE_EVENT, (message) =>
        (0, rxjs_1.from)(handler(message, new pubsub_context_1.PubSubContext([message, pattern])))
          .pipe(
            (0, rxjs_1.mergeMap)((handler) => ((0, rxjs_1.isObservable)(handler) ? handler : (0, rxjs_1.of)(handler))),
            (0, rxjs_1.first)(),
          )
          .subscribe(),
      )
      .on(constants_1.ERROR_EVENT, (err) => this.logger.error(err));
  }
}
exports.PubSubServer = PubSubServer;
//# sourceMappingURL=pubsub.server.js.map
