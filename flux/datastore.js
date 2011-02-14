var sys = require('sys'),
    events = require('events'),
    redis = require('./lib/node_redis');

var DataStore = function() {
    events.EventEmitter.call(this);
    this.store = redis.createClient();
}

sys.inherits(DataStore, events.EventEmitter);

DataStore.prototype.getMoteById = function(channel, moteId, callback) {
    this.store.get("mote:"+moteId, function(error, message) {
        callback(channel, message);
    });
}

DataStore.prototype.planExists = function(client, data, callback) {
    var self = this;
    this.store.get("plan:"+data, function(error, plan_id) {
        var plan_id = plan_id;
        self.store.get("plan:"+plan_id+":latest_mote", function(error, latest_mote_id) {
            self.store.get("mote:"+latest_mote_id, function(error, latest_mote) {
                callback(client, plan_id, latest_mote);
            });
        });
    });
};

DataStore.prototype.setResponse = function(plan, mote, client, response) {
    this.store.hset(plan+":mote:"+mote, client.persistentSessionId, response);
};

module.exports = DataStore;
