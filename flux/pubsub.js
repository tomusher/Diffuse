var sys = require('sys'),
    events = require('events'),
    redis = require('./lib/node_redis');

var PubSub = function() {
    var self = this;
    events.EventEmitter.call(self);
    self.subscriber = redis.createClient();
    self.subscriber.psubscribe("*");
    self.subscriber.on("pmessage", function(pattern, channel, message) {
        var message = JSON.parse(message);
        self.emit(message.event, channel, message.data);
    });
}

sys.inherits(PubSub, events.EventEmitter);

module.exports = PubSub;
