var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    sys = require('sys'),
    events = require('events'),
    connect = require('connect'),
    url = require('url'),
    async = require('async'),
    Socket = require('./socket'),
    DataStore = require('./datastore'),
    PubSub = require('./pubsub'),
    redis = require('./lib/node_redis'),
    redis_store = require('connect-redis');

var COOKIE_AGE = 10800000 // 3 hours

server = connect.createServer(
    connect.cookieDecoder(),
    connect.session({   secret: '5516,3BP#w#W7.6I`6jbpP8m=V83Oe',
                        store: new redis_store({
                            maxAge: COOKIE_AGE,
                            cookie: { path: '/', httpOnly: false },
                        })
                    }),
    connect.staticProvider({ root: __dirname+'/static', cache: false }),
    connect.router(app),
    connect.bodyDecoder()
);
server.listen('8040');

function app(app) {
    app.get('/', function(req, res){
        var path = url.parse(req.url).pathname;
        fs.readFile(__dirname+'/static/get.html', function(err, data){
            if(err) return send404(res);
            var headers = {'Content-Type':'text/html',};
            headers['Access-Control-Allow-Origin'] = "*";
            res.writeHead(200, headers);
            res.write(data, 'utf8');
            res.end();
        });
    });
}

send404 = function(res){
   res.writeHead(404);
   res.write('404');
   res.end();
};

var dataStore = new DataStore();
var socket = new Socket(server, dataStore);
var pubSub = new PubSub();

// On new mote over pubsub
pubSub.on('adminPublishedMote', function(channel, message) {
    sys.puts("New message from "+channel+": "+message);
    dataStore.getMoteById(channel, message.mote_id, 
        function() { 
            socket.sendMote.apply(socket, arguments); 
        });
});

pubSub.on('serverPublishedResponse', function(channel, message) {
    socket.sendToAdmins({event: 'serverPushedResponse', data: message});
});

// On request for whether a plan exists
socket.on('clientRequestedPlan', function(client, data) {
    sys.puts("Client "+client+" asking for plan "+data);
    dataStore.planExists(client, data, 
        function() { 
            socket.setPlan.apply(socket, arguments); 
        });
});

// On receiving a response from client
socket.on('clientRespondedToMote', function(client, data) {
    dataStore.setResponse(data.plan, data.mote_id, client, data.message);
    data.client = client.persistentSessionId;
    dataStore.store.publish(data.plan, JSON.stringify({event: 'serverPublishedResponse', data: data}));
});

// On receiving a request for responses from admin
socket.on('adminRequestedResponses', function(client, data) {
    dataStore.getResponses(client, data,
        function() {
            socket.sendResponses.apply(socket, arguments);
        });
});

// On receiving a request to clear responses from admin
socket.on('adminClearedResponses', function(client, data) {
    dataStore.clearMoteResponses(data.plan, data.mote_id);
    dataStore.getResponses(client, data,
        function() {
            socket.sendResponses.apply(socket, arguments);
        });
});

// On new client connection
socket.on('clientConnected', function(client, data) {
    if(data=='admin') {
        socket.addAdmin(client);
    } else {
        client.persistentSessionId = encodeURIComponent(data);
        dataStore.newClientId(client);
    }
});

// On client disconnection
socket.on('clientDisconnected', function(client, message) {
    if(client.persistentSessionId) {
        dataStore.clearClientResponses(client);
        dataStore.removeClientId(client, function(allDisconnected) {
            if(allDisconnected) {
                socket.sendToAdmins({event: 'clientDisconnected', data: { client: client.persistentSessionId }});
            }
        });
    }
});
