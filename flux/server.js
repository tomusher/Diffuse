var http = require('http'),
    fs = require('fs'),
    sys = require('sys'),
    connect = require('connect'),
    io = require('./lib/socket.io'),
    url = require('url'),

    redis = require("./lib/node_redis"),
    redis_sub = redis.createClient(),
    redis_req = redis.createClient();

redis.debug_mode = true;

server = connect.createServer();
server.use("/respond", connect.router(respond));
server.use(connect.router(templates));
server.use(connect.staticProvider({ root: __dirname+'/static', cache: false }));
server.use(connect.bodyDecoder());
server.listen('8040');

io = io.listen(server);

function respond(app) {
    app.post('/', function(req, res) {
        console.log(req.body);
        res.writeHead(200, 'Content-Type text/html');
        res.end();
    });
}

function templates(app) {
    app.get('/', function(req, res){
        var path = url.parse(req.url).pathname;
        fs.readFile(__dirname + path, function(err, data){
            if(err) return send404(res);
            res.writeHead(200, {'Content-Type': path == 'json.js'? 'text/javascript':'text/html'});
            res.write(data, 'utf8');
            res.end();
        });
    });
}

function plan_exists(client, value) {
    redis_req.get(value, function(err, value) {
        var plan_exists = false;
        if(value!=null) {
            plan_exists = true;
        };
        client.send({method: 'plan_exists', value: plan_exists});
    });
}

send404 = function(res){
   res.writeHead(404);
   res.write('404');
   res.end();
};

redis_sub.psubscribe('*');
redis_sub.on("pmessage", function(pattern, channel, message) {
    var output = "[" + channel;
    if(pattern)
        output += " (from pattern '" + pattern + "')";
    output += "]: " + message;
    redis_req.get(message, function(err, value){
        sys.puts(value);
        io.broadcast({method: 'new_mote', value: {channel: channel, message: JSON.parse(value)}});
    });
});

io.on('connection', function(client) {
    sys.puts("New client: "+client);

    client.on('message', function(message) {
        sys.puts("Client: "+client.sessionId+" sent message: "+message);
        switch(message.method) {
            case "plan_exists":
                plan_exists(client, message.value)
                break;
            case "mote_response":
                break;
            default:
                break;
        }
    });
});
