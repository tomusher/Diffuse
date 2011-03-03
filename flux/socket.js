var sys = require('sys'),
    io = require('./lib/socket.io'),
    events = require('events');

var Socket = module.exports = function(server, dataStore) {
    events.EventEmitter.call(this);
    var self = this;
    this.admins = [];
    this.server = server;
    this.dataStore = dataStore;
    this.io = io.listen(server);
    this.io.on('connection', function(client) {
        sys.puts("New client: "+client);
        client.on("message", function(message) {
            sys.puts("Client: "+client.sessionId+" sent message: "+message.event);
            self.emit(message.event, client, message.data);
        });
        client.on("disconnect", function() {
            self.emit("clientDisconnected", client); 
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
        event: 'serverPushedMote', 
        data: { 
            channel: channel,
            message: JSON.parse(mote)
        }
    };

    this.broadcast(message);
};

Socket.prototype.setPlan = function(client, plan_id, latest_mote) {
    var data = {
        event: 'serverSetPlan',
        data: {
            plan_id: plan_id,
            latest_mote: JSON.parse(latest_mote)
        }
    }

    this.send(client, data);
};

Socket.prototype.sendResponses = function(client, plan, mote_id, responses) {
    console.log("Trying to send responses");
    var data = {
        event: 'serverSentResponses',
        data: {
            mote_id: mote_id,
            plan: plan,
            response: responses
        }
    }

    this.send(client, data);
};

Socket.prototype.addAdmin = function(client) {
    this.admins.push(client);
};

Socket.prototype.sendToAdmins = function(message) {
    for(var i = 0; i < this.admins.length; i++) {
        if(this.admins[i].connected) {
            this.send(this.admins[i], message);
        } else {
            this.admins.splice(i, 1);
        }
    };
};


