var sys = require('sys'),
    events = require('events'),
    redis = require('./lib/node_redis');

var DataStore = function() {
    events.EventEmitter.call(this);
    this.store = redis.createClient();
}

sys.inherits(DataStore, events.EventEmitter);

DataStore.prototype.getMoteById = function(channel, mote_id, callback) {
    this.store.get("mote:"+mote_id, function(error, message) {
        callback(channel, message);
    });
}

DataStore.prototype.planExists = function(client, data, callback) {
    var self = this;
    this.store.get("plan:"+data, function(error, plan_id) {
        var plan_id = plan_id;
        self.store.get("plan:"+plan_id+":latest_mote", function(error, latest_mote_id) {
            self.getMoteById("plan:"+plan_id, latest_mote_id, function(channel, latest_mote) {
                self.store.get("plan:"+plan_id+":name", function(error, plan_name) {
                    callback(client, plan_id, plan_name, latest_mote);
                });
            });
        });
    });
};

DataStore.prototype.setResponse = function(plan, mote, client, response) {
    this.store.sadd("responses:"+client.persistentSessionId, plan+":mote:"+mote);
    this.store.hset(plan+":mote:"+mote, client.persistentSessionId, JSON.stringify(response));
};

DataStore.prototype.getResponses = function(client, data, callback) {
    this.store.hgetall(data.plan+":mote:"+data.mote_id, function(error, responses) {
        callback(client, data.plan, data.mote_id, responses);
    });
};

DataStore.prototype.clearMoteResponses = function(plan, mote) {
    var self = this;
    this.store.del(plan+":mote:"+mote, function(error, response) {
    });
};

DataStore.prototype.clearClientResponses = function(client) {
    var self = this;
    this.store.smembers("responses:"+client.persistentSessionId, function(error, responses){
        for(var i=0;i<responses.length;i++) { 
           self.store.hdel(responses[i], client.persistentSessionId); 
        };
    });
    this.store.del("responses:"+client.persistentSessionId);
};

DataStore.prototype.newClientId = function(client) {
    var self = this;
    this.store.sadd("ids:"+client.persistentSessionId, client.sessionId);
};

DataStore.prototype.removeClientId = function(client, callback) {
    var self = this;
    this.store.srem("ids:"+client.persistentSessionId, client.sessionId, function(error, response) {
        self.store.scard("ids:"+client.persistentSessionId, function(error, response) {
            if(response==0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
};

module.exports = DataStore;
