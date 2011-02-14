var http = require('http'),
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
    connect.session({   secret: 'secretkey',
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

var socket = new Socket(server);
var dataStore = new DataStore();
var pubSub = new PubSub();

pubSub.on('newMessage', function(channel, message) {
    sys.puts("New message from "+channel+": "+message);
    dataStore.getMoteById(channel, message, 
        function() { 
            socket.sendMote.apply(socket, arguments); 
        });
});

socket.on('planExists', function(client, data) {
    sys.puts("Client "+client+" asking for plan "+data);
    dataStore.planExists(client, data, 
        function() { 
            socket.setPlan.apply(socket, arguments); 
        });
});

socket.on('moteResponse', function(client, data) {
    dataStore.setResponse(data.plan, data.mote_id, client, data.message);
    dataStore.store.publish(data.plan, "updateadmin");
    console.log(data);
});

socket.on('clientConnect', function(client, data) {
    client.persistentSessionId = data;
});
