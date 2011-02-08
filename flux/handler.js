var sys = require('sys'),
    events = require('events');

var Handler = function(socket, redis_sub) {
    events.EventEmitter.call(this);
    this.socket = socket;
    this.redis_sub = redis_sub;
}

sys.inherits(Handler, events.EventEmitter);

Handler.prototype.subscribe = function() {
    var self = this;
    this.redis_sub.psubscribe('*');
    this.redis_sub.on("pmessage", function(pattern, channel, message) {
        self.emit('newMote', channel, message);
    });
}


module.exports = Handler
