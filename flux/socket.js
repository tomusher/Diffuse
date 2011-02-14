var sys = require('sys'),
    io = require('./lib/socket.io'),
    events = require('events');

var Socket = module.exports = function(server) {
    events.EventEmitter.call(this);
    var self = this;
    this.server = server;
    this.test = "Test";
    this.io = io.listen(server);
    this.io.on('connection', function(client) {
        sys.puts("New client: "+client);
        client.on("message", function(message) {
            sys.puts("Client: "+client.sessionId+" sent message: "+message.event);
            self.emit(message.event, client, message.data);
        });
    });
}

sys.inherits(Socket, events.EventEmitter);

Socket.prototype.broadcast = function(message) {
    this.io.broadcast(message);
};

Socket.prototype.send = function(client, message) {
    client.send(message);
};

Socket.prototype.sendMote = function(channel, mote) {
    var message = {
        event: 'newMote', 
        data: { 
            channel: channel,
            message: JSON.parse(mote)
        }
    };

    this.broadcast(message);
};

Socket.prototype.setPlan = function(client, plan_id, latest_mote) {
    var message = {
        event: 'setPlan',
        data: {
            plan_id: plan_id,
            latest_mote: JSON.parse(latest_mote)
        }
    }

    this.send(client, message);
};
